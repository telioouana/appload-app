"use client"

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CURRENCY } from "@/backend/db/types";
import { useTRPC } from "@/backend/trpc/client";

import { KPIs_TABS, PERIOD } from "../../../types/types";
import { KPIsDataSection } from "../sections/kpis-data-section";
import { KPIsHeaderSection } from "../sections/kpis-header-section";
import { KPIsDataWindowSection } from "../sections/kpis-data-window-section";

export function KPIsView({ endDate: initialEndDate, startDate: initialStartDate, time }: { endDate: Date, startDate: Date, time?: PERIOD }) {
    // Manage date state locally so the UI and Queries update on period change
    const [dates, setDates] = useState({ start: initialStartDate, end: initialEndDate });
    const [currency, setCurrency] = useState<typeof CURRENCY[number]>("MZN")
    const [tab, setTab] = useState<KPIs_TABS>("operational")

    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.shipperKpis.report.queryOptions({
            endDate: dates.end,
            currency,
            startDate: dates.start,
            section: tab,
        })
    )

    return (
        <div className="flex flex-col gap-6">
            <KPIsHeaderSection />
            <KPIsDataWindowSection setDates={setDates} time={time} />
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
