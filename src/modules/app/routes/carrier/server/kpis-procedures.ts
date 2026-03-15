import { z } from "zod";

import { CURRENCY } from "@/backend/db/types";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";

const SECTION = ["operational", "incidents", "costs", "efficiency"] as const;

function buildMockReport(section: (typeof SECTION)[number]) {
    // Keep this aligned with what the KPI tabs destructure in:
    // - src/modules/app/routes/shipper/pages/kpis/components/tabs/*.tsx
    switch (section) {
        case "operational":
            return {
                trips: 42,
                onTimeAtLoading: 36,
                averageLoadingTime: 2.1,
                averageTravelTime: 3.8,
                distance: 1250_000,
                onTimeAtOffloading: 34,
                averageOffloadingTime: 1.6,
                demuragesOccurrences: 5,
                damuragesChargedDays: 9,
            };
        case "incidents":
            return {
                trips: 42,
                totalAccidents: 2,
                mechanicalIssues: 3,
                documentationIssues: 1,
                policeIssues: 2,
                percentageDamagedCargo: 1,
                percentageComplaints: 4,
            };
        case "costs":
            return {
                trips: 42,
                distance: 1250_000,
                weight: 1_800,
                total: 9_500_000,
            };
        case "efficiency":
            return {
                trips: 42,
                backload: 11,
                emissions: 725,
                total: 380_000,
            };
    }
}

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
        .query(async ({ input }) => {
            // Mock-only (carrier has no DB data yet).
            // We still accept the same input as shipper for drop-in UI compatibility.
            const { section } = input;
            return buildMockReport(section);
        }),

    onTime: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async () => {
            return [
                { totalOnTime: 5, total: 6, date: new Date("2026-03-01") },
                { totalOnTime: 7, total: 8, date: new Date("2026-03-06") },
                { totalOnTime: 6, total: 7, date: new Date("2026-03-10") },
                { totalOnTime: 9, total: 10, date: new Date("2026-03-14") },
            ];
        }),

    incidents: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async () => {
            return {
                accidents: 2,
                mechanical: 3,
                docummentation: 1,
                inspection: 2,
            };
        }),

    loading: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async () => {
            return [
                { load: 2, date: new Date("2026-03-01") },
                { load: 3, date: new Date("2026-03-06") },
                { load: 2, date: new Date("2026-03-10") },
                { load: 4, date: new Date("2026-03-14") },
            ];
        }),

    offloading: protectedProcedure
        .input(
            z.object({
                endDate: z.date(),
                startDate: z.date(),
                currency: z.enum(CURRENCY),
            })
        )
        .query(async () => {
            return [
                { offload: 1, date: new Date("2026-03-01") },
                { offload: 2, date: new Date("2026-03-06") },
                { offload: 2, date: new Date("2026-03-10") },
                { offload: 3, date: new Date("2026-03-14") },
            ];
        }),
});
