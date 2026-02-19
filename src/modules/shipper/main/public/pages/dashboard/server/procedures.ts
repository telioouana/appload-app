import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, avg, between, count, eq, ne, sql, sum } from "drizzle-orm";

import { db } from "@/backend/db";
import { order, trip } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";


export const dashboardRouter = createTRPCRouter({
    activity: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [stats] = await db
                .select({
                    private: {
                        orders: sql<number>`count(${order.id}) filter (where ${order.share} = 'subscribers')`.mapWith(Number),
                        drafted: sql<number>`count(${order.id}) filter (where ${order.status} = 'drafted' and ${order.share} = 'subscribers')`.mapWith(Number),
                        pending: sql<number>`count(${order.id}) filter (where ${order.status} = 'pending' and ${order.share} = 'subscribers')`.mapWith(Number),
                        shipped: sql<number>`count(${order.id}) filter (where ${order.status} = 'on-going' and ${order.share} = 'subscribers')`.mapWith(Number),
                        delivered: sql<number>`count(${order.id}) filter (where ${order.status} = 'delivered' and ${order.share} = 'subscribers')`.mapWith(Number),
                    },
                    public: {
                        orders: sql<number>`count(${order.id}) filter (where ${order.share} = 'non-subscribers')`.mapWith(Number),
                        drafted: sql<number>`count(${order.id}) filter (where ${order.status} = 'drafted' and ${order.share} = 'non-subscribers')`.mapWith(Number),
                        pending: sql<number>`count(${order.id}) filter (where ${order.status} = 'pending' and ${order.share} = 'non-subscribers')`.mapWith(Number),
                        shipped: sql<number>`count(${order.id}) filter (where ${order.status} = 'on-going' and ${order.share} = 'non-subscribers')`.mapWith(Number),
                        delivered: sql<number>`count(${order.id}) filter (where ${order.status} = 'delivered' and ${order.share} = 'non-subscribers')`.mapWith(Number),
                    }
                })
                .from(order)
                .where(and(
                    eq(order.shipperId, session.activeOrganizationId),
                    ne(order.status, "completed"),
                    ne(order.status, "cancelled"),
                ))

            return stats
        }),

    resume: protectedProcedure
        .input(
            z.object({
                startDate: z.date(),
                endDate: z.date(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { startDate, endDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [orders] = await db
                .select({
                    trips: count().mapWith(Number),
                    totalAmount: sum(trip.shipperTotal).mapWith(Number),
                    averagePrice: avg(trip.shipperTotal).mapWith(Number),
                    deliveries: sum(trip.deliveries).mapWith(Number),
                    totalWeight: sum(trip.loadedWeight).mapWith(Number),
                    averageWeight: avg(trip.loadedWeight).mapWith(Number),
                    distanceCovered: sum(order.distance).mapWith(Number),
                    averageDistance: avg(order.distance).mapWith(Number),

                })
                .from(order)
                .innerJoin(trip, eq(trip.orderId, order.id))
                .where(
                    and(
                        eq(order.shipperId, session.activeOrganizationId),
                        eq(order.status, "completed"),
                        eq(trip.status, "completed"),
                        between(trip.createdAt, startDate, endDate),
                    )
                )

            return orders
        })
})