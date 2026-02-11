"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { UserType } from "@/modules/main/ui/types";
import KPIsSection from "@/modules/main/pages/kpis/ui/section/kpis-section";

export function KPIsView({ endDate, startDate, userType }: { endDate: Date, startDate: Date, userType: UserType }) {
    return (
        <Suspense fallback={<div>Loading activity...</div>}>
            <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                <KPIsSection
                    endDate={endDate}
                    startDate={startDate}
                    userType={userType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
