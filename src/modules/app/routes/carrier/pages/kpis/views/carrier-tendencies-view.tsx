"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/backend/trpc/client";

import { TendenciesOnTimeCard } from "@/modules/app/routes/carrier/pages/kpis/components/cards/tendencies-on-time-card";
import { TendenciesLoadingCard } from "@/modules/app/routes/carrier/pages/kpis/components/cards/tendencies-loading-card";
import { TendenciesIncidentsCard } from "@/modules/app/routes/carrier/pages/kpis/components/cards/tendencies-incidents-card";
import { TendenciesOffloadingCard } from "@/modules/app/routes/carrier/pages/kpis/components/cards/tendencies-offloading-card";

export function CarrierTendenciesView({ endDate, startDate }: { endDate: Date, startDate: Date }) {
    const trpc = useTRPC()

    const { data: onTime } = useSuspenseQuery(
        trpc.carrierKpis.onTime.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: incidents } = useSuspenseQuery(
        trpc.carrierKpis.incidents.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: loading } = useSuspenseQuery(
        trpc.carrierKpis.loading.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    const { data: offloading } = useSuspenseQuery(
        trpc.carrierKpis.offloading.queryOptions({
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
                            <TendenciesOnTimeCard data={onTime} />
                            <TendenciesIncidentsCard data={incidents} />
                            <TendenciesLoadingCard data={loading} />
                            <TendenciesOffloadingCard data={offloading} />
                        </div>
                    </div>
                </ErrorBoundary>
            </Suspense>
        </div>
    )
}
