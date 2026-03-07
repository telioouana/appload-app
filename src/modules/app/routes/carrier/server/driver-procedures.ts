import { z } from "zod"
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, lt, or, sql } from "drizzle-orm";

import { db } from "@/backend/db";
import { driver, tracking, trip, truck, user } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";
import { FLEET_STATUS } from "@/backend/db/types";

export const driverRouter = createTRPCRouter({
    resume: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [stats] = await db
                .select({
                    total: count(driver.id).mapWith(Number),
                    active: sql<number>`count(${driver.id}) filter(where ${driver.status} = 'active')`,
                    idle: sql<number>`count(${driver.id}) filter(where ${driver.status} = 'idle')`,
                    free: sql<number>`count(${driver.id}) filter(where ${driver.status} = 'free')`,
                })
                .from(driver)
                .where(eq(driver.carrierId, session.activeOrganizationId))

            return stats
        }),

    drivers: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(8),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
                status: z.enum(FLEET_STATUS).nullish()
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, limit, status } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const drivers = await db
                .select()
                .from(driver)
                .innerJoin(user, eq(user.id, driver.userId))
                .leftJoin(truck, eq(truck.driver, driver.id))
                .leftJoin(trip, eq(trip.driverId, driver.id))
                .leftJoin(tracking, eq(tracking.truckPlate, truck.regPlate))
                .where(and(
                    eq(driver.carrierId, session.activeOrganizationId),
                    status 
                        ? eq(driver.status, status)
                        : undefined,
                    cursor
                        ? or(
                            lt(driver.updatedAt, cursor.updatedAt),
                            and(
                                eq(driver.updatedAt, cursor.updatedAt),
                                lt(driver.legacyId, cursor.id),
                            )
                        )
                        : undefined,
                ))
                .orderBy(desc(driver.legacyId), desc(driver.updatedAt))
                // Checking if there are more orders from the current user
                .limit(limit + 1)

            const hasMore = drivers.length > limit
            // Removing the last item if there are more drivers
            const items = hasMore ? drivers.slice(0, - 1) : drivers
            // Setting the next cursor to the last item if there are more drivers
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.driver.legacyId,
                        updatedAt: lastItem.driver.updatedAt,
                    }
                    : null

            return {
                items,
                nextCursor
            }
        })
})