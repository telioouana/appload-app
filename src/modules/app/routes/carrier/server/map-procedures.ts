import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike, or, sql, type SQL } from "drizzle-orm";

import { db } from "@/backend/db";
import { tracking, trip, truck } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";

type TripStatus =
    | "to-loading" | "at-loading" | "loading"
    | "waiting-documents" | "on-route" | "stopped" | "issue"
    | "at-border" | "at-offloading" | "offloading";

const getStatusFilter = (filterBy: string): TripStatus[] => {
    switch (filterBy) {
        case "loading":
            return ["at-loading", "loading"];
        case "moving":
            return ["to-loading", "on-route", "at-border"];
        case "stopped":
            return ["stopped"];
        case "issue":
            return ["issue"];
        case "offloading":
            return ["at-offloading", "offloading"];
        default:
            return [];
    }
};

export const carrierMapRouter = createTRPCRouter({
    positions: protectedProcedure
        .input(
            z.object({
                search: z.string().optional(),
                filterBy: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth;
            const { search, filterBy } = input;

            if (!session.activeOrganizationId) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const filters: (SQL | undefined)[] = [
                eq(trip.carrierId, session.activeOrganizationId),
                sql`${trip.status} NOT IN ('completed', 'cancelled', 'booked')`,
            ];

            if (search?.trim()) {
                const searchTerm = `%${search.trim()}%`;
                filters.push(
                    or(
                        ilike(truck.regPlate, searchTerm),
                        ilike(tracking.truckPlate, searchTerm),
                        ilike(truck.internalId, searchTerm)
                    )
                );
            }

            if (filterBy && filterBy !== "all") {
                const targetStatuses = getStatusFilter(filterBy);
                if (targetStatuses.length > 0) {
                    filters.push(sql`${trip.status} IN ${targetStatuses}`);
                }
            }

            const positions = await db
                .select({
                    tripId: trip.id,
                    tripLegacyId: trip.legacyId,
                    status: trip.status,
                    location: tracking.location,
                    updatedAt: tracking.updatedAt,

                    // Truck data
                    truckInternalId: truck.internalId,
                    truckId: truck.id,
                    regPlate: truck.regPlate,
                    currentPlate: tracking.truckPlate,
                    model: truck.model,
                })
                .from(trip)
                .innerJoin(tracking, eq(trip.id, tracking.tripId))
                .leftJoin(truck, eq(tracking.truckPlate, truck.regPlate))
                .where(and(...filters))
                .orderBy(sql`${tracking.updatedAt} DESC`);

            return positions;
        })
})