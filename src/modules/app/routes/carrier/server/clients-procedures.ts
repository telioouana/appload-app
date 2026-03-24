import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { alias } from "drizzle-orm/pg-core"
import { and, countDistinct, desc, eq, lt, or, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { organization, network, order, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

export const clientsRouter = createTRPCRouter({
    clients: protectedProcedure
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

            const shippers = alias(organization, "shippers")

            const clients = await db
                .select({
                    id: shippers.id,
                    name: shippers.name,
                    logo: shippers.logo,
                    address: shippers.billingAddress,
                    trips: countDistinct(trip.id).mapWith(Number),
                    revenue: sum(trip.carrierTotal).mapWith(Number),
                    createdAt: shippers.createdAt
                })
                .from(shippers)
                .innerJoin(network, and(
                    eq(network.shipperId, shippers.id),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                .innerJoin(order, and(
                    eq(order.shipperId, shippers.id),
                    eq(order.share, "subscribers")
                ))
                .innerJoin(trip, and(
                    eq(trip.orderId, order.id),
                    eq(trip.carrierId, session.activeOrganizationId),
                    eq(trip.status, "completed")
                ))
                .where(
                    cursor
                        ? or(
                            lt(shippers.createdAt, cursor.createdAt),
                            and(
                                eq(shippers.createdAt, cursor.createdAt),
                                lt(shippers.id, cursor.id),
                            )
                        )
                        : undefined
                )
                .groupBy(
                    shippers.id,
                    shippers.name,
                    shippers.logo,
                    shippers.billingAddress,
                    shippers.createdAt
                ).orderBy(desc(shippers.createdAt), desc(shippers.id))
                // Checking if there are more clients from the current user
                .limit(limit + 1)

            const hasMore = clients.length > limit
            // Removing the last item if there are more clients
            const items = hasMore ? clients.slice(0, - 1) : clients
            // Setting the next cursor to the last item if there are more clients
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

            const shippers = alias(organization, "shippers")

            const [resume] = await db
                .select({
                    clients: countDistinct(shippers.id).mapWith(Number),
                    trips: countDistinct(trip.id).mapWith(Number),
                    revenue: sum(trip.carrierTotal).mapWith(Number)
                })
                .from(shippers)
                .innerJoin(network, and(
                    eq(network.shipperId, shippers.id),
                    eq(network.carrierId, session.activeOrganizationId)
                ))
                .innerJoin(order, and(
                    eq(order.shipperId, shippers.id),
                    eq(order.share, "subscribers")
                ))
                .innerJoin(trip, and(
                    eq(trip.orderId, order.id),
                    eq(trip.carrierId, session.activeOrganizationId),
                    eq(trip.status, "completed")
                ))

            return resume
        }),
})