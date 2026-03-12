import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { and, count, desc, eq, lt, or, sql } from "drizzle-orm"

import { db } from "@/backend/db"
import { FLEET_STATUS, LOADING_BAY } from "@/backend/db/types"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { driver, link, truck, trailer, user, tracking, trip } from "@/backend/db/schema"

import { BaseSchema } from "../ui/components/dialog/register-fleet-dialog"

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
                .select({
                    truck: {
                        code: truck.internalId,
                        plate: truck.regPlate,
                        status: truck.status,
                        age: truck.year,
                        type: truck.type,
                        loading: truck.loadingBay
                    },
                    trailer: {
                        code: trailer.internalId,
                        plate: trailer.regPlate,
                        status: trailer.status,
                        loading: trailer.loadingBay
                    },
                    link: {
                        code: link.internalId,
                        plate: link.regPlate,
                        status: link.status,
                        loading: link.loadingBay
                    }
                })
                .from(truck)
                .leftJoin(trailer, and(eq(trailer.truckId, truck.id), eq(trailer.carrierId, session.activeOrganizationId)))
                .leftJoin(link, and(eq(link.trailerId, trailer.id), eq(link.carrierId, session.activeOrganizationId)))
                .where(eq(truck.carrierId, session.activeOrganizationId))

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
                values: BaseSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const { truck: vehicle } = values

            const loadingBay = vehicle.type === "articulated"
                ? {
                    width: vehicle.loadingBay?.width ?? 0,
                    length: vehicle.loadingBay?.length ?? 0,
                    height: vehicle.loadingBay?.height ?? 0,
                    volume: vehicle.loadingBay?.volume ?? 0,
                    capacity: vehicle.loadingBay?.capacity ?? 0,
                    type: vehicle.loadingBay?.type as typeof LOADING_BAY[number]
                }
                : null

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

            if (vehicle.type === "articulated" && values.trailer) {
                const [insertTrailer] = await db
                    .insert(trailer)
                    .values({
                        truckId: insertTruck.id,
                        carrierId: session.activeOrganizationId,
                        status: FLEET_STATUS[2],

                        internalId: values.trailer.internalId,
                        regPlate: values.trailer.regPlate,
                        brand: values.trailer.brand,
                        model: values.trailer.model,
                        year: values.trailer.year,
                        vin: values.trailer.vin,
                        loadingBay: values.trailer.loadingBay,
                        booklet: values.trailer.booklet,
                        license: values.trailer.license,
                    })
                    .returning()

                if (!insertTrailer) throw new TRPCError({ code: "BAD_REQUEST" })
                
                if(values.link){
                    await db
                    .insert(link)
                    .values({
                        trailerId: insertTrailer.id,
                        carrierId: session.activeOrganizationId,
                        status: FLEET_STATUS[2],

                        internalId: values.link.internalId,
                        regPlate: values.link.regPlate,
                        brand: values.link.brand,
                        model: values.link.model,
                        year: values.link.year,
                        vin: values.link.vin,
                        loadingBay: values.link.loadingBay,
                        booklet: values.link.booklet,
                        license: values.link.license,
                    })
                    .returning()
                }
            }

        })
})