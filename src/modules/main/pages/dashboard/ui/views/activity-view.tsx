"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { UserType } from "@/modules/main/ui/types";
import { ActivitySection } from "@/modules/main/pages/dashboard/ui/section/activity-section";

export function ActivityView({ userType }: { userType: UserType }) {
    return (
        <Suspense fallback={<div>Loading activity...</div>}>
            <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                <ActivitySection userType={userType} />
            </ErrorBoundary>
        </Suspense>
    )
}
