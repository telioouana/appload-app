"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { TRIPS_PATH } from "../../../types/types"
import { TripsResumeSection } from "../sections/trips-resume-section"

export function TripsResumeView({ path, search, cargoType }: { path: TRIPS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <TripsResumeSection
                    path={path}
                    search={search}
                    cargoType={cargoType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
