import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, or, sql } from "drizzle-orm"

import { db } from "@/backend/db"
import { FLEET_STATUS, LOADING_BAY } from "@/backend/db/types"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { driver, link, truck, trailer, user, tracking, trip } from "@/backend/db/schema"
import { TrailerSchema, TruckSchema } from "../schemas/fleet"

export const fleetRouter = createTRPCRouter({
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
                .from(truck)
                .where(eq(truck.carrierId, session.activeOrganizationId))

            return stats
        }),

    offer: protectedProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const fleet = await db
                .select()
                .from(truck)
                .leftJoin(trailer, eq(trailer.truckId, truck.id))
                .leftJoin(link, eq(link.trailerId, trailer.id))
                .where(eq(truck.carrierId, session.activeOrganizationId))

            console.log()
            return fleet
        }),

    fleet: protectedProcedure
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

            const fleet = await db
                .select()
                .from(truck)
                .innerJoin(driver, and(eq(driver.truckId, truck.id), eq(driver.carrierId, session.activeOrganizationId)))
                .innerJoin(user, and(eq(user.id, driver.userId), eq(user.type, "driver")))
                .leftJoin(trailer, and(eq(trailer.truckId, truck.id), eq(trailer.carrierId, session.activeOrganizationId)))
                .leftJoin(link, and(eq(link.trailerId, trailer.id), eq(link.carrierId, session.activeOrganizationId)))
                .leftJoin(trip, eq(trip.truckPlate, truck.regPlate))
                .leftJoin(tracking, eq(tracking.truckPlate, truck.regPlate))
                .where(and(
                    eq(truck.carrierId, session.activeOrganizationId),
                    status
                        ? eq(truck.status, status)
                        : undefined,
                    cursor
                        ? or(
                            lt(truck.updatedAt, cursor.updatedAt),
                            and(
                                eq(truck.updatedAt, cursor.updatedAt),
                                lt(truck.legacyId, cursor.id),
                            )
                        )
                        : undefined,
                ))
                .orderBy(desc(truck.legacyId), desc(driver.updatedAt))
                // Checking if there are more orders from the current user
                .limit(limit + 1)

            const hasMore = fleet.length > limit
            // Removing the last item if there are more fleet
            const items = hasMore ? fleet.slice(0, - 1) : fleet
            // Setting the next cursor to the last item if there are more fleet
            const lastItem = items[items.length - 1]
            const nextCursor =
                hasMore
                    ? {
                        id: lastItem.truck.legacyId,
                        updatedAt: lastItem.truck.updatedAt,
                    }
                    : null

            return {
                items,
                nextCursor
            }
        }),

    add: protectedProcedure
        .input(
            z.object({
                truck: TruckSchema,
                trailer: TrailerSchema.partial().optional(),
                link: TrailerSchema.partial().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { truck: vehicle, trailer: atrelado, link: connection } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const loadingBay = vehicle.type === "non-articulated"
                ? {
                    width: vehicle.loadingBay?.width ?? 0,
                    length: vehicle.loadingBay?.length ?? 0,
                    height: vehicle.loadingBay?.height ?? 0,
                    volume: vehicle.loadingBay?.volume ?? 0,
                    capacity: vehicle.loadingBay?.capacity ?? 0,
                    type: vehicle.loadingBay?.type as typeof LOADING_BAY[number]
                }
                : null

            const emptyLoadingBay = {
                width: 0,
                length: 0,
                height: 0,
                volume: 0,
                capacity: 0,
                type: "flatbed" as const // Use any valid enum value as default
            };

            const [insertTruck] = await db
                .insert(truck)
                .values({
                    carrierId: session.activeOrganizationId,
                    status: FLEET_STATUS[2],

                    internalId: vehicle.internalId,
                    regPlate: vehicle.regPlate,
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    vin: vehicle.vin,
                    type: vehicle.type,
                    loadingBay: loadingBay,
                    booklet: vehicle.booklet,
                    license: vehicle.license,
                })
                .returning()

            if (!insertTruck) throw new TRPCError({ code: "BAD_REQUEST" })

            if (vehicle.type === "articulated" && atrelado) {
                const [insertTrailer] = await db
                    .insert(trailer)
                    .values({
                        truckId: insertTruck.id,
                        carrierId: session.activeOrganizationId,
                        status: FLEET_STATUS[2],

                        internalId: atrelado.internalId ?? null,
                        regPlate: atrelado.regPlate ?? "",
                        brand: atrelado.brand ?? "",
                        model: atrelado.model ?? "",
                        year: atrelado.year ?? new Date().getFullYear(),
                        vin: atrelado.vin ?? "",
                        loadingBay: atrelado.loadingBay ?? emptyLoadingBay,
                        booklet: atrelado.booklet ?? null,
                        license: atrelado.license ?? null,
                    })
                    .returning();

                if (!insertTrailer) throw new TRPCError({ code: "BAD_REQUEST" })

                if (connection) {
                    await db
                        .insert(link)
                        .values({
                            trailerId: insertTrailer.id,
                            carrierId: session.activeOrganizationId,
                            status: FLEET_STATUS[2],

                            internalId: connection.internalId,
                            regPlate: connection.regPlate ?? "",
                            brand: connection.brand ?? "",
                            model: connection.model ?? "",
                            year: connection.year ?? new Date().getFullYear(),
                            vin: connection.vin ?? "",
                            loadingBay: connection.loadingBay ?? emptyLoadingBay,
                            booklet: connection.booklet ?? null,
                            license: connection.license ?? null,
                        })
                        .returning()
                }
            }

        })
})