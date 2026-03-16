import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, or, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { cargo, order, tracking, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

export const historyRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, limit } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const location = db.select().from(tracking).where(eq(tracking.tripId, trip.id)).orderBy(desc(tracking.createdAt)).limit(1).as("location")

            const trips = await db
                .select()
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .leftJoinLateral(location, sql`true`)
                .where(and(
                    eq(trip.carrierId, session.activeOrganizationId),
                    or(
                        eq(trip.status, "completed"),
                        eq(trip.status, "cancelled"),
                    ),
                    cursor
                        ? or(
                            lt(trip.updatedAt, cursor.updatedAt),
                            and(
                                eq(trip.updatedAt, cursor.updatedAt),
                                lt(trip.legacyId, cursor.id),
                            )
                        )
                        : undefined,
                ))
                .orderBy(desc(trip.legacyId), desc(trip.updatedAt))
                // Checking if there are more trips from the current user
                .limit(limit + 1)

            const hasMore = trips.length > limit
            // Removing the last item if there are more trips
            const items = hasMore ? trips.slice(0, - 1) : trips
            // Setting the next cursor to the last item if there are more trips
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.trip.legacyId,
                        updatedAt: lastItem.trip.updatedAt,
                    }
                    : null

            return {
                items,
                nextCursor
            }
        }),

    resume: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [trips] = await db
                .select({
                    trips: count(trip).mapWith(Number),
                    total: sum(trip.carrierTotal).mapWith(Number),
                    distance: sql<number>`sum(${order.distance}) / 1000`.mapWith(Number)
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .where(and(
                    eq(trip.carrierId, session.activeOrganizationId),
                    or(
                        eq(trip.status, "completed"),
                        eq(trip.status, "cancelled"),
                    )
                ))

            return trips
        }),
})