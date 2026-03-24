import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, or, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { FISCAL_REGIME, TRIP_TYPE, TRUCK_AGE, WEIGHT_UNIT } from "@/backend/db/types"
import { cargo, kyc, network, order, organization, trip } from "@/backend/db/schema"

import { TripSchema } from "../schemas/trip"
import { getLogisticsTripType } from "@/lib/google"

const PATHS = ["all", "private", "public"] as const

export const ordersRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                path: z.enum(PATHS),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, path, limit } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const orders = await db
                .select({
                    order: order,
                    cargo: cargo,
                    organizationId: organization.id,
                    organizationName: organization.name,
                    fiscalRegime: kyc.fiscalRegime,
                })
                .from(order)
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .innerJoin(organization, eq(organization.id, session.activeOrganizationId))
                .leftJoin(kyc, eq(kyc.organizationId, session.activeOrganizationId))
                .leftJoin(network, and(
                    eq(network.shipperId, order.shipperId),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                .where(and(
                    eq(order.status, "open"),
                    path === "private"
                        ? and(
                            eq(order.share, "subscribers"),
                            eq(network.carrierId, session.activeOrganizationId)
                        )
                        : path === "public"
                            ? eq(order.share, "non-subscribers")
                            : or(
                                eq(order.share, "non-subscribers"),
                                and(
                                    eq(order.share, "subscribers"),
                                    eq(network.carrierId, session.activeOrganizationId)
                                )
                            ),
                    cursor
                        ? or(
                            lt(order.updatedAt, cursor.updatedAt),
                            and(
                                eq(order.updatedAt, cursor.updatedAt),
                                lt(order.legacyId, cursor.id),
                            )
                        )
                        : undefined,
                ))
                .orderBy(desc(order.legacyId), desc(order.updatedAt))
                // Checking if there are more orders from the current user
                .limit(limit + 1)

            const hasMore = orders.length > limit
            // Removing the last item if there are more orders
            const items = hasMore ? orders.slice(0, - 1) : orders
            // Setting the next cursor to the last item if there are more orders
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.order.legacyId,
                        updatedAt: lastItem.order.updatedAt,
                    }
                    : null

            return {
                items,
                nextCursor
            }
        }),

    resume: protectedProcedure
        .input(
            z.object({
                path: z.enum(PATHS),
            })
        )
        .query(async ({ ctx, input }) => {
            const { path } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [orders] = await db
                .select({
                    orders: count(order).mapWith(Number),
                    total: sum(order.price).mapWith(Number),
                    distance: sql<number>`sum(${order.distance}) / 1000`.mapWith(Number)
                })
                .from(order)
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .leftJoin(network, and(
                    eq(network.shipperId, order.shipperId),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                .where(and(
                    eq(order.status, "open"),
                    path === "private"
                        ? and(
                            eq(order.share, "subscribers"),
                            eq(network.carrierId, session.activeOrganizationId)
                        )
                        : path === "public"
                            ? eq(order.share, "non-subscribers")
                            : or(
                                eq(order.share, "non-subscribers"),
                                and(
                                    eq(order.share, "subscribers"),
                                    eq(network.carrierId, session.activeOrganizationId)
                                )
                            ),
                ))

            return orders
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

            const tripType = await getLogisticsTripType(values.loading.placeId, values.offloading.placeId)

            const [data] = await db
                .insert(trip)
                .values({
                    orderId: values.orderId,
                    carrierId: values.carrierId,
                    carrierName: values.carrierName,

                    driverId: values.driverId,
                    driverName: values.driverName,
                    driverPhoneNumber: values.driverPhoneNumber,
                    driverPassport: values.driverPassport,
                    truckPlate: values.truckPlate,
                    truckAge: values.truckAge as typeof TRUCK_AGE[number],
                    trailerPlate: values.trailerPlate,
                    linkPlate: values.linkPlate,

                    proposedLoadingDate: values.proposedLoadingDate, arrivalAtLoading: null,
                    proposedOffloadingDate: values.proposedOffloadingDate,

                    weightUnit: values.weightUnit as typeof WEIGHT_UNIT[number],

                    status: "booked",
                    tripType: tripType.tripType as typeof TRIP_TYPE[number],

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
                    loadFactor: tripType.tripType === "backload" ? "0.8" : tripType.tripType === "normal" ? "1" : "",
                    defaultCoefficient: tripType.tripType === "backload" ? "0.03" : tripType.tripType === "normal" ? "0.12" : "",
                    totalFuelCost: tripType.tripType === "backload" ? String((values.distance / 1000) * 0.5 * 86) : "0"
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