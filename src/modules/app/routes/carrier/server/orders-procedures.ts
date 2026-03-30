import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, or, SQL, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { FISCAL_REGIME, TRIP_TYPE, TRUCK_AGE, WEIGHT_UNIT } from "@/backend/db/types"
import { cargo, kyc, network, offer, order, organization, trip } from "@/backend/db/schema"

import { TripSchema } from "../schemas/trip"

const PATHS = ["all", "private", "public"] as const

export const ordersRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(20),
                path: z.enum(PATHS),
                search: z.string().optional(),
                cargoType: z.string().optional(),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth;
            const { cursor, path, limit, search, cargoType } = input;

            if (!session.activeOrganizationId) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            // 1. Core Filter: Only show 'open' orders for the Carrier Marketplace
            const filters: (SQL | undefined)[] = [
                eq(order.status, "open")
            ];

            // 2. Path-based Access Logic
            const isPublic = eq(order.share, "non-subscribers");
            const isPrivate = and(
                eq(order.share, "subscribers"),
                eq(network.carrierId, session.activeOrganizationId)
            );

            if (path === "private") {
                filters.push(isPrivate);
            } else if (path === "public") {
                filters.push(isPublic);
            } else {
                // path === "all"
                filters.push(or(isPublic, isPrivate));
            }

            // 3. Robust Search Logic (ID and Address States)
            if (search?.trim()) {
                const cleanedSearch = search.trim();
                const searchTerm = `%${cleanedSearch.toLowerCase()}%`;

                const numericPart = cleanedSearch.replace(/\D/g, "");
                const numericId = numericPart ? parseInt(numericPart, 10) : null;

                const searchOrConditions: (SQL | undefined)[] = [
                    sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                ];

                if (numericId !== null) {
                    searchOrConditions.push(eq(order.legacyId, numericId));
                    searchOrConditions.push(sql`CAST(${order.legacyId} AS TEXT) LIKE ${numericPart + '%'}`);
                    searchOrConditions.push(sql`('ORD-' || LPAD(CAST(${order.legacyId} AS TEXT), 4, '0')) ILIKE ${searchTerm}`);
                }

                filters.push(or(...searchOrConditions));
            }

            // 4. Cargo Category Filter
            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            // 5. Cursor Pagination Logic
            if (cursor) {
                filters.push(
                    or(
                        lt(order.updatedAt, cursor.updatedAt),
                        and(
                            eq(order.updatedAt, cursor.updatedAt),
                            lt(order.legacyId, cursor.id)
                        )
                    )
                );
            }

            // 6. Execute Query with Carrier Identity Joins
            const result = await db
                .select({
                    order: order,
                    cargo: cargo,
                    offer: offer,
                    // These fields reflect the Carrier for cross-screen state persistence
                    organizationId: organization.id,
                    organizationName: organization.name,
                    fiscalRegime: kyc.fiscalRegime,
                })
                .from(order)
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                // Joins to Carrier's own profile for organization/fiscal data
                .innerJoin(organization, eq(organization.id, session.activeOrganizationId))
                .innerJoin(kyc, eq(kyc.organizationId, session.activeOrganizationId))
                // Left join to network to validate private access
                .leftJoin(network, and(
                    eq(network.shipperId, order.shipperId),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                // Left join to offer to see if current carrier already bid
                .leftJoin(offer, and(
                    eq(offer.orderId, order.id),
                    eq(offer.carrierId, session.activeOrganizationId)
                ))
                .where(and(...filters))
                .orderBy(desc(order.updatedAt), desc(order.legacyId))
                .limit(limit + 1);

            const hasMore = result.length > limit;
            const items = hasMore ? result.slice(0, -1) : result;

            const nextCursor = (hasMore && items.length > 0)
                ? {
                    id: items[items.length - 1].order.legacyId,
                    updatedAt: items[items.length - 1].order.updatedAt,
                }
                : null;

            return {
                items,
                nextCursor
            };
        }),

    resume: protectedProcedure
        .input(
            z.object({
                path: z.enum(PATHS),
                search: z.string().optional(),
                cargoType: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { path, search, cargoType } = input;
            const { session } = ctx.auth;

            if (!session.activeOrganizationId) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            // 1. Initial Filter: Only 'open' orders
            const filters: (SQL | undefined)[] = [
                eq(order.status, "open")
            ];

            // 2. Access Logic (Public vs Private)
            const isPublic = eq(order.share, "non-subscribers");
            const isPrivate = and(
                eq(order.share, "subscribers"),
                eq(network.carrierId, session.activeOrganizationId)
            );

            if (path === "private") {
                filters.push(isPrivate);
            } else if (path === "public") {
                filters.push(isPublic);
            } else {
                filters.push(or(isPublic, isPrivate));
            }

            // 3. Robust Search Logic (Matching the availableOrders procedure)
            if (search?.trim()) {
                const searchTerm = `%${search.trim().toLowerCase()}%`;
                const searchId = parseInt(search.trim());

                filters.push(
                    or(
                        sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                        sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                        !isNaN(searchId) ? eq(order.legacyId, searchId) : undefined
                    )
                );
            }

            // 4. Cargo Category Filter
            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            // 5. Aggregate Query
            const [stats] = await db
                .select({
                    orders: count(order).mapWith(Number),
                    total: sum(order.price).mapWith(Number),
                    // Converting meters to KM and ensuring numeric return
                    distance: sql<number>`COALESCE(SUM(${order.distance}), 0) / 1000`.mapWith(Number)
                })
                .from(order)
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                // Join network to validate private load access
                .leftJoin(network, and(
                    eq(network.shipperId, order.shipperId),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                .where(and(...filters));

            // Fallback for when no orders match the filter
            return stats || { orders: 0, total: 0, distance: 0 };
        }),

    accept: protectedProcedure
        .input(
            z.object({
                values: TripSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [data] = await db
                .insert(trip)
                .values({
                    orderId: values.orderId,
                    carrierId: values.carrierId,

                    driverId: values.driverId,
                    driverName: values.driverName,
                    driverPhoneNumber: values.driverPhoneNumber,
                    driverPassport: values.driverPassport,
                    truckPlate: values.truckPlate,
                    truckAge: values.truckAge as typeof TRUCK_AGE[number],
                    trailerPlate: values.trailerPlate,
                    linkPlate: values.linkPlate,

                    proposedLoadingDate: values.proposedLoadingDate,
                    proposedOffloadingDate: values.proposedOffloadingDate,

                    weightUnit: values.weightUnit as typeof WEIGHT_UNIT[number],

                    status: "booked",
                    tripType: values.tripType as typeof TRIP_TYPE[number],

                    carrierName: values.carrierName,
                    fiscalRegime: values.fiscalRegime as typeof FISCAL_REGIME[number],
                    carrierSubtotal: String(values.carrierSubtotal),
                    carrierVAT: String(values.carrierVAT),
                    carrierTotal: String(values.carrierTotal),
                    carrierCurrency: values.carrierCurrency,

                    shipperSubtotal: String(values.shipperSubtotal),
                    shipperVAT: String(values.shipperVAT),
                    shipperTotal: String(values.shipperTotal),
                    shipperCurrency: values.shipperCurrency,

                    ageFactor: values.truckAge === "recent" ? "1" : "1.2",
                    loadFactor: values.tripType === "backload" ? "0.8" : values.tripType === "normal" ? "1" : "",
                    defaultCoefficient: values.tripType === "backload" ? "0.03" : values.tripType === "normal" ? "0.12" : "",
                    totalFuelCost: values.tripType === "backload" ? String((values.distance / 1000) * 0.5 * 86) : "0"
                })
                .returning()

            if (!data) throw new TRPCError({ code: "BAD_REQUEST" })

            await db
                .update(order)
                .set({
                    status: "booked"
                })
                .where(eq(order.id, values.orderId))
        })
})