"use client"

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CURRENCY } from "@/backend/db/types";
import { useTRPC } from "@/backend/trpc/client";

import { KPIs_TABS } from "@/modules/app/routes/shipper/types/types";
import { KPIsDataSection } from "@/modules/app/routes/shipper/pages/kpis/sections/kpis-data-section";
import { KPIsHeaderSection } from "@/modules/app/routes/shipper/pages/kpis/sections/kpis-header-section";
import { KPIsDataWindowSection } from "@/modules/app/routes/shipper/pages/kpis/sections/kpis-data-window-section";

export function CarrierKPIsView({ endDate: initialEndDate, startDate: initialStartDate }: { endDate: Date, startDate: Date }) {
    const [dates, setDates] = useState({ start: initialStartDate, end: initialEndDate });
    const [currency, setCurrency] = useState<typeof CURRENCY[number]>("MZN")
    const [tab, setTab] = useState<KPIs_TABS>("operational")

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.carrierKpis.report.queryOptions({
            endDate: dates.end,
            currency,
            startDate: dates.start,
            section: tab,
        })
    )

    return (
        <div className="flex flex-col gap-6">
            <KPIsHeaderSection />
            <KPIsDataWindowSection setDates={setDates} />
            <Suspense fallback={<div>Loading activity...</div>}>
                <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                    <KPIsDataSection
                        data={data}
                        currency={currency}
                        setCurrency={setCurrency}
                        setTab={setTab}
                        tab={tab}
                    />
                </ErrorBoundary>
            </Suspense>
        </div>
    )
}
