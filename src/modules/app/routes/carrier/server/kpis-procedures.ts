import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, avg, between, count, eq, sql, sum } from "drizzle-orm";

import { db } from "@/backend/db";
import { CURRENCY } from "@/backend/db/types";
import { order, trip } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";

const SECTION = ["operational", "incidents", "costs", "efficiency"] as const

export const carrierKpisRouter = createTRPCRouter({
    report: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                section: z.enum(SECTION),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { currency, endDate, section, startDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [kpis] = await db
                .select(
                    section === "operational"
                        ? {
                            trips: count().mapWith(Number),
                            onTimeAtLoading: sql`sum(case when ${trip.arrivalOnTimeLoading} then 1 else 0 end)`.mapWith(Number),
                            averageLoadingTime: avg(trip.daysSpendLoading).mapWith(Number),
                            averageTravelTime: avg(trip.daysSpendTraveling).mapWith(Number),
                            distance: sql<number>`sum(distinct ${order.distance})`.mapWith(Number),
                            onTimeAtOffloading: sql`sum(case when ${trip.arrivalOnTimeOffloading} then 1 else 0 end)`.mapWith(Number),
                            averageOffloadingTime: avg(trip.daysSpendOffloading).mapWith(Number),
                            demuragesOccurrences: sql`sum(case when ${trip.demurageCharged} then 1 else 0 end)`.mapWith(Number),
                            damuragesChargedDays: sum(trip.totalDemurageChargedDays).mapWith(Number)
                        }
                        : section === "incidents"
                            ? {
                                trips: count().mapWith(Number),
                                totalAccidents: sum(trip.numberAccidents).mapWith(Number),
                                mechanicalIssues: sum(trip.totalMechanicalFailuresDelayedDays).mapWith(Number),
                                documentationIssues: sum(trip.totalDocumentationIssuesDelayedDays).mapWith(Number),
                                policeIssues: sum(trip.totalPoliceDelayedDays).mapWith(Number),
                                percentageDamagedCargo: sql`sum(case when ${trip.cargoDamaged} then 1 else 0 end)`.mapWith(Number),
                                percentageComplaints: sql`sum(case when ${trip.claimed} then 1 else 0 end)`.mapWith(Number),
                            }
                            : section === "costs"
                                ? {
                                    trips: count().mapWith(Number),
                                    distance: sql<number>`sum(distinct ${order.distance})`.mapWith(Number),
                                    weight: sum(trip.loadedWeight).mapWith(Number),
                                    total: sum(trip.carrierTotal).mapWith(Number),
                                }
                                : {
                                    trips: count().mapWith(Number),
                                    backload: sql<number>`count(${trip.id}) filter (where ${trip.tripType} = 'backload')`.mapWith(Number),
                                    emissions: sql<number>`sum(${trip.defaultCoefficient} * ${trip.loadFactor} * ${trip.ageFactor} * (${order.distance} / 1000) * ${trip.loadedWeight}) filter (where ${trip.tripType} = 'backload')`.mapWith(Number),
                                    total: sql<number>`sum(((${trip.carrierTotal} - ${trip.totalFuelCost}) / ${trip.totalFuelCost}) * 100) filter (where ${trip.tripType} = 'backload')`.mapWith(Number),
                                }
                )
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .where(and(
                    eq(order.status, "completed"),
                    eq(trip.status, "completed"),
                    eq(order.currency, currency),
                    between(trip.createdAt, startDate, endDate),
                    eq(trip.carrierId, session.activeOrganizationId)
                ))

            return kpis
        }),

    onTime: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { currency, endDate, startDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const kpis = await db
                .select({
                    totalOnTime: sql<number>`sum(case when ${trip.arrivalOnTimeLoading} then 1 else 0 end)`,
                    total: count(trip).mapWith(Number),
                    date: trip.arrivalAtLoading
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .where(and(
                    eq(order.status, "completed"),
                    eq(trip.status, "completed"),
                    eq(order.currency, currency),
                    between(trip.createdAt, startDate, endDate),
                    eq(trip.carrierId, session.activeOrganizationId)
                ))
                .groupBy(trip.arrivalAtLoading)


            return kpis
        }),

    incidents: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { currency, endDate, startDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const [kpis] = await db
                .select({
                    accidents: sum(trip.numberAccidents).mapWith(Number),
                    mechanical: sum(trip.numberOfMechanicalFailuresStops).mapWith(Number),
                    docummentation: sum(trip.numberOfDocumentationIssuesStops).mapWith(Number),
                    inspection: sum(trip.numberOfPoliceStops).mapWith(Number),
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .where(and(
                    eq(order.status, "completed"),
                    eq(trip.status, "completed"),
                    eq(order.currency, currency),
                    between(trip.createdAt, startDate, endDate),
                    eq(trip.carrierId, session.activeOrganizationId)
                ))

            return kpis
        }),

    loading: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { currency, endDate, startDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const kpis = await db
                .select({
                    load: avg(trip.daysSpendLoading).mapWith(Number),
                    date: trip.arrivalAtLoading
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .where(and(
                    eq(order.status, "completed"),
                    eq(trip.status, "completed"),
                    eq(order.currency, currency),
                    between(trip.createdAt, startDate, endDate),
                    eq(trip.carrierId, session.activeOrganizationId)
                ))
                .groupBy(trip.arrivalAtLoading)


            return kpis
        }),

    offloading: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { currency, endDate, startDate } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            const kpis = await db
                .select({
                    offload: avg(trip.daysSpendOffloading).mapWith(Number),
                    date: trip.arrivalAtLoading
                })
                .from(trip)
                .innerJoin(order, eq(trip.orderId, order.id))
                .where(and(
                    eq(order.status, "completed"),
                    eq(trip.status, "completed"),
                    eq(order.currency, currency),
                    between(trip.createdAt, startDate, endDate),
                    eq(trip.carrierId, session.activeOrganizationId)
                ))
                .groupBy(trip.arrivalAtLoading)


            return kpis
        })
})