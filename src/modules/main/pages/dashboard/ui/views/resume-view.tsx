"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { UserType } from "@/modules/main/ui/types";
import { ResumeSection } from "@/modules/main/pages/dashboard/ui/section/resume-section";

export function ResumeView({ userType }: { userType: UserType }) {
    return (
        <Suspense fallback={<div>Loading resume...</div>}>
            <ErrorBoundary fallback={<div>Error loading resume.</div>}>
                <ResumeSection userType={userType} />
            </ErrorBoundary>
        </Suspense>
    )
}
