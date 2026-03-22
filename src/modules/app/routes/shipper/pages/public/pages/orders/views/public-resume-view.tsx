"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PublicResumeSection } from "../section/public-resume-section"

export function PublicResumeView({ path, search, cargoType }: { path: ORDERS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <PublicResumeSection path={path} search={search} cargoType={cargoType} />
            </ErrorBoundary>
        </Suspense>
    )
}
