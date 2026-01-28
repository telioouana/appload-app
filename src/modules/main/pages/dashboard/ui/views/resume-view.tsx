"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ResumeSection } from "@/modules/main/pages/dashboard/ui/section/resume-section";

export function ResumeView() {
    return (
        <Suspense fallback={<div>Loading resume...</div>}>
            <ErrorBoundary fallback={<div>Error loading resume.</div>}>
                <ResumeSection />
            </ErrorBoundary>
        </Suspense>
    )
}
