"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ActivitySection } from "@/modules/main/pages/dashboard/ui/section/activity-section";

export function ActivityView() {
    return (
        <Suspense fallback={<div>Loading activity...</div>}>
            <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                <ActivitySection />
            </ErrorBoundary>
        </Suspense>
    )
}
