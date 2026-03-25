"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { HistoryResumeSection } from "../sections/history-resume-section"

export function HistoryResumeView({ search, cargoType }: { search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <HistoryResumeSection
                    search={search}
                    cargoType={cargoType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
