"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/backend/trpc/client";

import { TendenciesSavingsCard } from "../cards/tendencies-savings-card";
import { TendenciesIncidentsCard } from "../cards/tendencies-incidents-card";
import { TendenciesPerformanceCard } from "../cards/tendencies-performance-card";
import { TendenciesEmissionsCard } from "../cards/tendencies-emissions-card";

export function TendenciesView({ endDate, startDate }: { endDate: Date, startDate: Date }) {
    const trpc = useTRPC()

    const { data: performance } = useSuspenseQuery(
        trpc.kpis.performance.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: incidents } = useSuspenseQuery(
        trpc.kpis.incidents.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: emissions } = useSuspenseQuery(
        trpc.kpis.emissions.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: savings } = useSuspenseQuery(
        trpc.kpis.savings.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    return (
        <div className="flex flex-col gap-6">
            <Suspense fallback={<div>Loading activity...</div>}>
                <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                    <div className="flex flex-col gap-y-6">
                        <h2 className="text-xl font-bold">Performance Trends</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TendenciesPerformanceCard data={performance} />
                            <TendenciesIncidentsCard data={incidents} />
                            <TendenciesEmissionsCard data={emissions} />
                            <TendenciesSavingsCard data={savings} />
                        </div>

                    </div>
                </ErrorBoundary>
            </Suspense>
        </div>
    )
}