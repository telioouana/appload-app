import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, ne, or, sql, sum, ilike, type SQL } from "drizzle-orm"

import { db } from "@/backend/db"
import { cargo, order, tracking, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

const PATHS = ["all", "booked", "on-going"] as const

export const tripsRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(20).default(8),
                path: z.enum(PATHS),
                search: z.string().optional(),
                cargoType: z.string().optional(),
                cursor: z.object({
                    id: z.number(),
                    updatedAt: z.date(),
                }).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { cursor, path, limit, search, cargoType } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const filters: (SQL | undefined)[] = [
                eq(trip.carrierId, session.activeOrganizationId),
                ne(trip.status, "cancelled"),
                ne(trip.status, "completed"),
            ]

            if (path === "on-going") {
                filters.push(ne(trip.status, "booked")) 
            } else if (path === "booked") {
                filters.push(eq(trip.status, "booked"))
            }

            // 1. Enhanced Search Logic
            if (search?.trim()) {
                const searchTerm = `%${search.trim().toLowerCase()}%`;
                const searchId = parseInt(search.trim());

                filters.push(
                    or(
                        // Address Search (JSONB)
                        sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                        sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                        // Trip/Order ID
                        !isNaN(searchId) ? eq(order.legacyId, searchId) : undefined,
                        // Driver & Truck Search
                        ilike(trip.driverName, searchTerm),
                        ilike(trip.truckPlate, searchTerm)
                    )
                );
            }

            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            if (cursor) {
                filters.push(or(
                    lt(trip.updatedAt, cursor.updatedAt),
                    and(
                        eq(trip.updatedAt, cursor.updatedAt),
                        lt(trip.legacyId, cursor.id),
                    )
                ))
            }

            const location = db
                .select()
                .from(tracking)
                .where(eq(tracking.tripId, trip.id))
                .orderBy(desc(tracking.createdAt))
                .limit(1)
                .as("tracking")

            const itemsFetched = await db
                .select({
                    trip: trip,
                    order: order,
                    cargo: cargo,
                    tracking: tracking,
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .leftJoinLateral(location, sql`true`)
                .where(and(...filters))
                .orderBy(desc(trip.updatedAt), desc(trip.legacyId))
                .limit(limit + 1)

            const hasMore = itemsFetched.length > limit
            const items = hasMore ? itemsFetched.slice(0, -1) : itemsFetched
            const lastItem = items[items.length - 1]

            const nextCursor = (hasMore && lastItem)
                ? { id: lastItem.trip.legacyId, updatedAt: lastItem.trip.updatedAt }
                : null

            return { items, nextCursor }
        }),

    resume: protectedProcedure
        .input(
            z.object({
                path: z.enum(PATHS),
                search: z.string().optional(),
                cargoType: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { path, search, cargoType } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const filters: (SQL | undefined)[] = [
                eq(trip.carrierId, session.activeOrganizationId),
                ne(trip.status, "cancelled"),
                ne(trip.status, "completed"),
            ]

            if (path === "on-going") {
                filters.push(ne(trip.status, "booked"))
            } else if (path === "booked") {
                filters.push(eq(trip.status, "booked"))
            }

            // 2. Matching Enhanced Search for Stats
            if (search?.trim()) {
                const searchTerm = `%${search.trim().toLowerCase()}%`;
                const searchId = parseInt(search.trim());
                filters.push(or(
                    sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                    !isNaN(searchId) ? eq(order.legacyId, searchId) : undefined,
                    ilike(trip.driverName, searchTerm),
                    ilike(trip.truckPlate, searchTerm)
                ));
            }

            if (cargoType?.trim()) {
                filters.push(eq(cargo.category, cargoType.trim()));
            }

            const [stats] = await db
                .select({
                    trips: count(trip).mapWith(Number),
                    total: sum(trip.carrierTotal).mapWith(Number),
                    distance: sql<number>`COALESCE(SUM(${order.distance}), 0) / 1000`.mapWith(Number)
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .innerJoin(cargo, eq(cargo.orderId, order.id))
                .where(and(...filters))

            return stats || { trips: 0, total: 0, distance: 0 }
        }),
})