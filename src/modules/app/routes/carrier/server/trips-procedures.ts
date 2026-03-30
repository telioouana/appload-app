import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, ne, or, sql, sum, ilike, type SQL } from "drizzle-orm"

import { db } from "@/backend/db"
import { cargo, order, tracking, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

import { ManageSchema } from "../schemas/trip"

const PATHS = ["all", "booked", "on-going"] as const

export const tripsRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(20).default(3),
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
            const { session } = ctx.auth
            const { cursor, path, limit, search, cargoType } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const filters: (SQL | undefined)[] = [
                eq(trip.carrierId, session.activeOrganizationId),
                ne(trip.status, "cancelled"),
                ne(trip.status, "completed"),
            ]

            if (path === "on-going") {
                filters.push(ne(trip.status, "booked"))
            } else if (path === "booked") {
                filters.push(eq(trip.status, "booked"))
            }

            // Enhanced Search Logic
            if (search?.trim()) {
                const cleanedSearch = search.trim();
                const searchTerm = `%${cleanedSearch.toLowerCase()}%`;
                const numericPart = cleanedSearch.replace(/\D/g, "");
                const numericId = numericPart ? parseInt(numericPart, 10) : null;

                const searchConditions = [
                    sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    ilike(trip.driverName, searchTerm),
                    ilike(trip.truckPlate, searchTerm)
                ];

                if (numericId !== null) {
                    searchConditions.push(eq(order.legacyId, numericId));
                    searchConditions.push(sql`CAST(${order.legacyId} AS TEXT) LIKE ${numericPart + '%'}`);
                    searchConditions.push(sql`('TRP-' || LPAD(CAST(${order.legacyId} AS TEXT), 4, '0')) ILIKE ${searchTerm}`);
                }

                filters.push(or(...searchConditions));
            }

            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            if (cursor) {
                filters.push(or(
                    lt(trip.updatedAt, cursor.updatedAt),
                    and(
                        eq(trip.updatedAt, cursor.updatedAt),
                        lt(trip.legacyId, cursor.id),
                    )
                ))
            }

            const location = db
                .select()
                .from(tracking)
                .where(eq(tracking.tripId, trip.id))
                .orderBy(desc(tracking.createdAt))
                .limit(1)
                .as("tracking")

            const itemsFetched = await db
                .select({
                    trip: trip,
                    order: order,
                    cargo: cargo,
                    tracking: tracking,
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .leftJoinLateral(location, sql`true`)
                .where(and(...filters))
                .orderBy(desc(trip.updatedAt), desc(trip.legacyId))
                .limit(limit + 1)

            const hasMore = itemsFetched.length > limit
            const items = hasMore ? itemsFetched.slice(0, -1) : itemsFetched
            const lastItem = items[items.length - 1]

            const nextCursor = (hasMore && lastItem)
                ? { id: lastItem.trip.legacyId, updatedAt: lastItem.trip.updatedAt }
                : null

            return { items, nextCursor }
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
            const { path, search, cargoType } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const filters: (SQL | undefined)[] = [
                eq(trip.carrierId, session.activeOrganizationId),
                ne(trip.status, "cancelled"),
                ne(trip.status, "completed"),
            ]

            if (path === "on-going") {
                filters.push(ne(trip.status, "booked"))
            } else if (path === "booked") {
                filters.push(eq(trip.status, "booked"))
            }

            if (search?.trim()) {
                const cleanedSearch = search.trim();
                const searchTerm = `%${cleanedSearch.toLowerCase()}%`;
                const numericPart = cleanedSearch.replace(/\D/g, "");
                const numericId = numericPart ? parseInt(numericPart, 10) : null;

                const searchConditions = [
                    sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    ilike(trip.driverName, searchTerm),
                    ilike(trip.truckPlate, searchTerm)
                ];

                if (numericId !== null) {
                    searchConditions.push(eq(order.legacyId, numericId));
                    searchConditions.push(sql`CAST(${order.legacyId} AS TEXT) LIKE ${numericPart + '%'}`);
                    searchConditions.push(sql`('TRP-' || LPAD(CAST(${order.legacyId} AS TEXT), 4, '0')) ILIKE ${searchTerm}`);
                }
                filters.push(or(...searchConditions));
            }

            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            const [stats] = await db
                .select({
                    trips: count(trip).mapWith(Number),
                    total: sum(trip.carrierTotal).mapWith(Number),
                    distance: sql<number>`COALESCE(SUM(${order.distance}), 0) / 1000`.mapWith(Number)
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .where(and(...filters))

            return stats || { trips: 0, total: 0, distance: 0 }
        }),

    manage: protectedProcedure
        .input(
            z.object({
                values: ManageSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input;
            const { session } = ctx.auth;

            if (!session.activeOrganizationId) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const [existingTrip] = await db
                .select()
                .from(trip)
                .where(eq(trip.id, values.tripId))
                .limit(1);

            if (!existingTrip) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
            }

            if (values.trackingId) {
                await db.update(tracking)
                    .set({
                        truckPlate: values.truckPlate,
                        location: values.location,
                    })
                    .where(eq(tracking.id, values.trackingId));
            } else {
                await db.insert(tracking).values({
                    tripId: values.tripId,
                    truckPlate: values.truckPlate,
                    location: values.location,
                });
            }

            const now = new Date();
            const MS_PER_DAY = 1000 * 60 * 60 * 24;

            const getDays = (start: Date | null, end: Date | null): number | null => {
                if (!start || !end) return null;
                const diff = end.getTime() - start.getTime();
                return Math.max(0, Math.ceil(diff / MS_PER_DAY));
            };

            const tripUpdate: Partial<typeof trip.$inferInsert> = {
                status: values.status,
            };

            if (values.status === "at-loading") tripUpdate.arrivalAtLoading = now;
            if (values.status === "loading") tripUpdate.actualLoadingDate = now;
            if (values.status === "on-route") tripUpdate.departureLoadingDate = now;
            if (values.status === "at-offloading") tripUpdate.arrivalAtOffloading = now;
            if (values.status === "completed") tripUpdate.actualOffloadingDate = now;

            const arrivalLoading = tripUpdate.arrivalAtLoading ?? existingTrip.arrivalAtLoading;
            const departureLoading = tripUpdate.departureLoadingDate ?? existingTrip.departureLoadingDate;
            const arrivalOffloading = tripUpdate.arrivalAtOffloading ?? existingTrip.arrivalAtOffloading;

            if (values.status === "on-route") {
                tripUpdate.daysSpendLoading = getDays(arrivalLoading, now);
            }

            if (values.status === "at-offloading") {
                tripUpdate.daysSpendTraveling = getDays(departureLoading, now);
            }

            if (values.status === "completed") {
                tripUpdate.daysSpendOffloading = getDays(arrivalOffloading, now);
            }

            const loadingDelay = getDays(existingTrip.proposedLoadingDate, arrivalLoading) ?? 0;
            const offloadingDelay = getDays(existingTrip.proposedOffloadingDate, arrivalOffloading) ?? 0;
            tripUpdate.totalDemurageChargedDays = loadingDelay + offloadingDelay;

            await db.update(trip)
                .set(tripUpdate)
                .where(eq(trip.id, values.tripId));

            if (values.status === "to-loading") {
                await db.update(order)
                    .set({ status: "on-going" })
                    .where(eq(order.id, values.orderId));
            }
        })
})