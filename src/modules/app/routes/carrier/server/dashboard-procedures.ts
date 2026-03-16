import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, avg, between, count, countDistinct, eq, sql, sum } from "drizzle-orm";

import { db } from "@/backend/db";
import { order, trip, truck } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";


export const carrierDashboardRouter = createTRPCRouter({
    activity: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [stats] = await db
                .select({
                    orders: sql<number>`count(${order.id}) filter (where ${order.status} = 'open')`.mapWith(Number),
                    trips: sql<number>`count(${order.id}) filter (where ${order.status} = 'on-going' and ${trip.carrierId} = ${session.activeOrganizationId})`.mapWith(Number),
                    fleet: countDistinct(truck.id).mapWith(Number),
                    revenue: sql<number>`sum(${trip.carrierTotal}) filter (where ${order.status} = 'on-going' and ${trip.carrierId} = ${session.activeOrganizationId})`.mapWith(Number),
                })
                .from(order)
                .leftJoin(trip, eq(trip.orderId, order.id))
                .leftJoin(truck, eq(truck.carrierId, session.activeOrganizationId))

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
                    totalAmount: sum(trip.carrierTotal).mapWith(Number),
                    averagePrice: avg(trip.carrierTotal).mapWith(Number),
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
                        eq(trip.carrierId, session.activeOrganizationId),
                        eq(order.status, "completed"),
                        eq(trip.status, "completed"),
                        between(trip.createdAt, startDate, endDate),
                    )
                )

            return orders
        })
})