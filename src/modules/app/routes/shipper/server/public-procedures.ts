import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, ne, or, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { cargo, order, timeline, tracking, trip } from "@/backend/db/schema"

const ORDER_STATUS = ["all", "drafted", "open", "booked", "on-going", "delivered", "history"] as const

export const publicRouter = createTRPCRouter({
    orders: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                path: z.enum(ORDER_STATUS),
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

            const status = db.select().from(timeline).where(eq(timeline.tripId, trip.id)).orderBy(desc(timeline.legacyId)).as("timeline")

            const orders = await db
                .select({
                    order: order,
                    cargo: cargo,
                    trip: trip,
                    tracking: tracking,
                    status: timeline
                })
                .from(order)
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .leftJoin(trip, eq(trip.orderId, order.id))
                .leftJoin(tracking, eq(tracking.tripId, trip.id))
                .leftJoinLateral(status, sql`true`)
                .where(and(
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "non-subscribers"),
                    path === "all"
                        ? and(
                            ne(order.status, "completed"),
                            ne(order.status, "cancelled"),
                            ne(order.status, "prospect"),
                        )
                        : path === "history"
                            ? and(
                                eq(order.status, "completed"),
                                ne(order.status, "cancelled")
                            )
                            : eq(order.status, path),
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
                path: z.enum(ORDER_STATUS),
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
                .where(and(
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "non-subscribers"),
                    path === "all"
                        ? and(
                            ne(order.status, "completed"),
                            ne(order.status, "cancelled"),
                            ne(order.status, "prospect"),
                        )
                        : path === "history"
                            ? and(
                                eq(order.status, "completed"),
                                ne(order.status, "cancelled")
                            )
                            : eq(order.status, path),
                ))

            return orders
        })
})