import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { alias } from "drizzle-orm/pg-core"
import { and, countDistinct, desc, eq, lt, or, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { organization, network, order, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

export const transportersRouter = createTRPCRouter({
    transporters: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                cursor: z.object({
                    id: z.string(),
                    createdAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, limit } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const carriers = alias(organization, "carriers")

            const transporters = await db
                .select({
                    id: carriers.id,
                    name: carriers.name,
                    logo: carriers.logo,
                    address: carriers.billingAddress,
                    trips: countDistinct(trip.id).mapWith(Number),
                    paid: sum(trip.shipperTotal).mapWith(Number),
                    createdAt: carriers.createdAt
                })
                .from(carriers)
                .innerJoin(network, and(
                    eq(network.shipperId, session.activeOrganizationId),
                    eq(network.carrierId, carriers.id)
                ))
                .innerJoin(order, and(
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "subscribers")
                ))
                .innerJoin(trip, and(
                    eq(trip.orderId, order.id),
                    eq(trip.carrierId, carriers.id),
                    eq(trip.status, "completed")
                ))
                .where(
                    cursor
                        ? or(
                            lt(carriers.createdAt, cursor.createdAt),
                            and(
                                eq(carriers.createdAt, cursor.createdAt),
                                lt(carriers.id, cursor.id),
                            )
                        )
                        : undefined
                )
                .groupBy(
                    carriers.id,
                    carriers.name,
                    carriers.billingAddress,
                    carriers.createdAt
                ).orderBy(desc(carriers.id), desc(carriers.createdAt))
                // Checking if there are more transporters from the current user
                .limit(limit + 1)

            const hasMore = transporters.length > limit
            // Removing the last item if there are more transporters
            const items = hasMore ? transporters.slice(0, - 1) : transporters
            // Setting the next cursor to the last item if there are more transporters
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.id,
                        createdAt: lastItem.createdAt,
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

            const carriers = alias(organization, "carriers")

            const [resume] = await db
                .select({
                    transporters: countDistinct(carriers.id).mapWith(Number),
                    trips: countDistinct(trip.id).mapWith(Number),
                    paid: sum(trip.shipperTotal).mapWith(Number)
                })
                .from(carriers)
                .innerJoin(network, and(
                    eq(network.shipperId, session.activeOrganizationId),
                    eq(network.carrierId, carriers.id)
                ))
                .innerJoin(order, and(
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "subscribers")
                ))
                .innerJoin(trip, and(
                    eq(trip.orderId, order.id),
                    eq(trip.carrierId, carriers.id),
                    eq(trip.status, "completed")
                ))

            return resume
        }),
})