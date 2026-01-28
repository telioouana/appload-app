import { TRPCError } from "@trpc/server";
import { and, avg, count, eq, sql, sum } from "drizzle-orm";

import { db } from "@/backend/db";
import { order, trip } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";


export const dashboardRouter = createTRPCRouter({
    activity: protectedProcedure
        .query(async ({ ctx }) => {
            const { user, session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const userType = user.type as "shipper" | "carrier"

            const [stats] = await db
                .select({
                    all: sql<number>`count(distinct ${order.id})`.mapWith(Number),
                    drafted: sql<number>`count(distinct ${order.id}) filter (where ${order.status} = 'drafted')`.mapWith(Number),
                    prospect: sql<number>`count(distinct ${order.id}) filter (where ${order.status} = 'prospect')`.mapWith(Number),
                    pending: sql<number>`count(distinct ${order.id}) filter (where ${order.status} = 'pending')`.mapWith(Number),
                    shipped: sql<number>`count(distinct ${order.id}) filter (where ${order.status} = 'on-going')`.mapWith(Number),
                    delivered: sql<number>`count(distinct ${order.id}) filter (where ${order.status} = 'delivered')`.mapWith(Number),
                })
                .from(order)
                .leftJoin(trip, eq(trip.orderId, order.id))
                .where(
                    userType === "shipper"
                        ? eq(order.shipperId, session.activeOrganizationId)
                        : eq(trip.carrierId, session.activeOrganizationId)
                )

            return stats
        }),

    resume: protectedProcedure
        .query(async ({ ctx }) => {
            const { user, session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const userType = user.type as "shipper" | "carrier"

            const [orders] = await db
                .select({
                    trips: count().mapWith(Number),
                    totalAmount: userType === "shipper" ? sum(trip.shipperTotal).mapWith(Number) : sum(trip.carrierTotal).mapWith(Number),
                    averagePrice: userType === "shipper" ? avg(trip.shipperTotal).mapWith(Number) : avg(trip.carrierTotal).mapWith(Number),
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
                        eq(order.status, "completed"),
                        eq(trip.status, "completed"),
                        userType === "shipper"
                            ? eq(order.shipperId, session.activeOrganizationId)
                            : eq(trip.carrierId, session.activeOrganizationId)
                    )
                )

            return orders
        })
})