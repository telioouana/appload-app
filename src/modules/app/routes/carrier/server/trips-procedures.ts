import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, ne, or, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { cargo, order, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

const PATHS = ["all", "booked", "on-going"] as const

export const tripsRouter = createTRPCRouter({
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

            const trips = await db
                .select()
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .where(and(
                    ne(trip.status, "cancelled"),
                    ne(trip.status, "completed"),
                    eq(trip.carrierId, session.activeOrganizationId),
                    path === "on-going"
                        ? and(
                            eq(trip.status, "to-loading"),
                            eq(trip.status, "at-loading"),
                            eq(trip.status, "loading"),
                            eq(trip.status, "waiting-documents"),
                            eq(trip.status, "on-route"),
                            eq(trip.status, "stopped"),
                            eq(trip.status, "issue"),
                            eq(trip.status, "at-border"),
                            eq(trip.status, "at-offloading"),
                            eq(trip.status, "offloading"),
                        )
                        : path === "booked"
                            ? eq(trip.status, path)
                            : undefined,
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
        .input(
            z.object({
                path: z.enum(PATHS),
            })
        )
        .query(async ({ ctx, input }) => {
            const { path } = input
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
                    ne(trip.status, "cancelled"),
                    ne(trip.status, "completed"),
                    path === "on-going"
                        ? and(
                            eq(trip.status, "to-loading"),
                            eq(trip.status, "at-loading"),
                            eq(trip.status, "loading"),
                            eq(trip.status, "waiting-documents"),
                            eq(trip.status, "on-route"),
                            eq(trip.status, "stopped"),
                            eq(trip.status, "issue"),
                            eq(trip.status, "at-border"),
                            eq(trip.status, "at-offloading"),
                            eq(trip.status, "offloading"),
                        )
                        : path === "booked"
                            ? eq(trip.status, path)
                            : undefined,
                ))

            return trips
        }),
})