import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, ne, or, SQL, sql, sum } from "drizzle-orm"

import { db } from "@/backend/db"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { cargo, order, timeline, tracking, trip } from "@/backend/db/schema"

const ORDER_STATUS = ["all", "drafted", "open", "booked", "on-going", "delivered", "history"] as const

export const publicRouter = createTRPCRouter({
    orders: protectedProcedure
            .input(
                z.object({
                    limit: z.number().min(1).max(20),
                    path: z.enum(ORDER_STATUS),
                    search: z.string().optional(),
                    cargoType: z.string().optional(),
                    cursor: z.object({
                        id: z.number(),
                        updatedAt: z.date(),
                    }).nullish(),
                })
            )
            .query(async ({ ctx, input }) => {
                const { session } = ctx.auth;
                const { cursor, path, limit, search, cargoType } = input;
    
                if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" });
    
                // 1. Define the dynamic filters array
                const filters: (SQL | undefined)[] = [
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "non-subscribers"),
                ];
    
                // 2. Handle Path/Status logic
                if (path === "all") {
                    filters.push(and(
                        ne(order.status, "prospect")
                    ));
                } else if (path === "history") {
                    filters.push(and(
                        eq(order.status, "completed"),
                        eq(order.status, "cancelled")
                    ));
                } else {
                    filters.push(eq(order.status, path));
                }
    
                // 3. Robust Search Logic
                // Inside your search logic in the tRPC procedure:
                if (search?.trim()) {
                    const searchTerm = `%${search.trim().toLowerCase()}%`; // Ensure lowercase
                    const searchId = parseInt(search.trim());
    
                    filters.push(
                        or(
                            // Target the 'address' or 'state' specifically inside the first element of the JSON array
                            sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                            sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                            !isNaN(searchId) ? eq(order.legacyId, searchId) : undefined
                        )
                    );
                }
    
                if (cargoType?.trim()) {
                    filters.push(eq(cargo.category, cargoType.trim()));
                }
    
                // 4. Cursor Pagination
                if (cursor) {
                    filters.push(or(
                        lt(order.updatedAt, cursor.updatedAt),
                        and(
                            eq(order.updatedAt, cursor.updatedAt),
                            lt(order.legacyId, cursor.id)
                        )
                    ));
                }
    
                // 5. Correct Lateral Join for the latest timeline status
                // We define the subquery without selecting it directly in the select list yet
                const statusSubquery = db
                    .select()
                    .from(timeline)
                    // IMPORTANT: Reference the outer trip.id here
                    .where(eq(timeline.tripId, trip.id))
                    .orderBy(desc(timeline.legacyId))
                    .limit(1)
                    .as("latest_status");
    
                const result = await db
                    .select({
                        order: order,
                        cargo: cargo,
                        trip: trip,
                        tracking: tracking,
                        status: {
                            id: statusSubquery.id,
                            status: statusSubquery.status,
                            legacyId: statusSubquery.legacyId,
                            createdAt: statusSubquery.createdAt,
                            updatedAt: statusSubquery.updatedAt,
                            tripId: statusSubquery.tripId,
                        },
                    })
                    .from(order)
                    .innerJoin(cargo, eq(cargo.orderId, order.id))
                    .leftJoin(trip, eq(trip.orderId, order.id))
                    .leftJoin(tracking, eq(tracking.tripId, trip.id))
                    // Change the join condition to true since the subquery is already filtered by trip.id
                    .leftJoinLateral(statusSubquery, sql`true`)
                    .where(and(...filters))
                    .orderBy(desc(order.updatedAt), desc(order.legacyId))
                    .limit(limit + 1);
    
                const hasMore = result.length > limit;
                const items = hasMore ? result.slice(0, -1) : result;
    
                const nextCursor = (hasMore && items.length > 0)
                    ? {
                        id: items[items.length - 1].order.legacyId,
                        updatedAt: items[items.length - 1].order.updatedAt,
                    }
                    : null;
    
                return { items, nextCursor };
            }),
    
        resume: protectedProcedure
            .input(
                z.object({
                    path: z.enum(ORDER_STATUS),
                    search: z.string().optional(),
                    cargoType: z.string().optional(),
                })
            )
            .query(async ({ ctx, input }) => {
                const { session } = ctx.auth
                const { path, search, cargoType } = input;
    
                if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })
    
                // 1. Define the dynamic filters array
                const filters: (SQL | undefined)[] = [
                    eq(order.shipperId, session.activeOrganizationId),
                    eq(order.share, "non-subscribers"),
                ];
    
                // 2. Handle Path/Status logic
                if (path === "all") {
                    filters.push(and(
                        ne(order.status, "prospect")
                    ));
                } else if (path === "history") {
                    filters.push(and(
                        eq(order.status, "completed"),
                        eq(order.status, "cancelled")
                    ));
                } else {
                    filters.push(eq(order.status, path));
                }
    
                // 3. Robust Search Logic
                // Inside your search logic in the tRPC procedure:
                if (search?.trim()) {
                    const searchTerm = `%${search.trim().toLowerCase()}%`; // Ensure lowercase
                    const searchId = parseInt(search.trim());
    
                    filters.push(
                        or(
                            // Target the 'address' or 'state' specifically inside the first element of the JSON array
                            sql`${order.loadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                            sql`${order.offloadingAddress}->0->>'state' ILIKE ${searchTerm}`,
                            !isNaN(searchId) ? eq(order.legacyId, searchId) : undefined
                        )
                    );
                }
    
                if (cargoType?.trim()) {
                    filters.push(eq(cargo.category, cargoType.trim()));
                }
    
                const [orders] = await db
                    .select({
                        orders: count(order).mapWith(Number),
                        total: sum(order.price).mapWith(Number),
                        distance: sql<number>`sum(${order.distance}) / 1000`.mapWith(Number)
                    })
                    .from(order)
                    .innerJoin(cargo, eq(cargo.orderId, order.id))
                    .where(and(...filters))
    
                return orders
            })
})