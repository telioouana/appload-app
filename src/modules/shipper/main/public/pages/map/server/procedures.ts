import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/backend/db";
import { order, trip, tracking } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";


export const mapRouter = createTRPCRouter({
    positions: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const positions = await db
                .select({
                    status: trip.status,
                    location: tracking.location,
                    updatedAt: tracking.updatedAt,
                })
                .from(order)
                .innerJoin(trip, eq(order.id, trip.orderId))
                .innerJoin(tracking, eq(trip.id, tracking.tripId))
                .where(and(
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.status, "on-going"),
                ))

            return positions;
        })
})