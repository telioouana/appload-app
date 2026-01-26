import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { alias } from "drizzle-orm/pg-core"
import { and, desc, eq, lt, ne, or } from "drizzle-orm"

import { db } from "@/backend/db"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { cargo, kyc, network, order, organization, trip } from "@/backend/db/schema"

type ORDER_STATUS = "prospect" | "drafted" | "pending" | "on-going" | "delivered" | "marketplace" | "history"
type TRIP_STATUS = "booked" | "at-loading" | "loading" | "waiting-documents" | "in-transit" | "stopped" | "at-border" | "at-offloading" | "offloading" | "completed"

export const ordersRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                filter: z.string().nullish(),
                filterBy: z.string().nullish(),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { user, session } = ctx.auth
            const { cursor, filter: filterType, filterBy: filterByType, limit } = input
            
            const filter = filterType as ORDER_STATUS | undefined
            const filterBy = filterByType as TRIP_STATUS | undefined

            const userType = user.type as "shipper" | "carrier"

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const shippers = alias(organization, "shippers")

            if (userType == "shipper") {
                const orders = await db
                    .select({
                        order: order,
                        cargo: cargo,
                        trip: trip,
                        organizationId: shippers.id,
                        organizationName: shippers.name,
                        fiscalRegime: kyc.fiscalRegime,
                    })
                    .from(order)
                    .innerJoin(cargo, eq(cargo.orderId, order.id))
                    .innerJoin(shippers, eq(shippers.id, session.activeOrganizationId))
                    .innerJoin(kyc, eq(kyc.organizationId, session.activeOrganizationId))
                    .leftJoin(trip, eq(trip.orderId, order.id))
                    .where(and(
                        eq(order.shipperId, session.activeOrganizationId),
                        filter
                            ? filter == "marketplace"
                                ? eq(order.share, "subscribers")
                                : filter == "history"
                                    ? or(
                                        eq(order.status, "completed"),
                                        eq(order.status, "cancelled")
                                    )
                                    : eq(order.status, filter)
                            : undefined,
                        filterBy
                            ? eq(trip.status, filterBy)
                            : undefined,
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
                    // Checking if there are more purchases from the current user
                    .limit(limit + 1)

                const hasMore = orders.length > limit
                // Removing the last item if there are more purchases
                const items = hasMore ? orders.slice(0, - 1) : orders
                // Setting the next cursor to the last item if there are more purchases
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
            } else {
                const carriers = alias(organization, "carriers")

                const orders = await db
                    .select({
                        order: order,
                        cargo: cargo,
                        trip: trip,
                        organizationId: carriers.id,
                        organizationName: carriers.name,
                        fiscalRegime: kyc.fiscalRegime,
                    })
                    .from(order)
                    .innerJoin(cargo, eq(cargo.orderId, order.id))
                    .innerJoin(carriers, eq(carriers.id, session.activeOrganizationId))
                    .innerJoin(kyc, eq(kyc.organizationId, session.activeOrganizationId))
                    .leftJoin(network, and(
                        eq(network.shipperId, order.shipperId),
                        eq(network.carrierId, session.activeOrganizationId)
                    ))
                    .leftJoin(trip, and(
                        eq(trip.orderId, order.id),
                        eq(trip.carrierId, session.activeOrganizationId)
                    ))
                    .where(and(
                        or(
                            eq(order.share, "non-subscribers"),
                            eq(trip.carrierId, session.activeOrganizationId),
                            eq(network.carrierId, session.activeOrganizationId),
                        ),
                        ne(order.status, "drafted"),
                        filter
                            ? filter == "marketplace"
                                ? eq(order.share, "subscribers")
                                : filter == "history"
                                    ? or(
                                        eq(order.status, "completed"),
                                        eq(order.status, "cancelled")
                                    )
                                    : eq(order.status, filter)
                            : undefined,
                        filterBy
                            ? eq(trip.status, filterBy)
                            : undefined,
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
                    // Checking if there are more purchases from the current user
                    .limit(limit + 1)

                const hasMore = orders.length > limit
                // Removing the last item if there are more purchases
                const items = hasMore ? orders.slice(0, - 1) : orders
                // Setting the next cursor to the last item if there are more purchases
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
            }
        })
})