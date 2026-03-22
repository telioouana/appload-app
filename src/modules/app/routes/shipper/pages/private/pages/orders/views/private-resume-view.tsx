"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PrivateResumeSection } from "../section/private-resume-section"

export function PrivateResumeView({ path, search, cargoType }: { path: ORDERS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <PrivateResumeSection path={path} search={search} cargoType={cargoType} />
            </ErrorBoundary>
        </Suspense>
    )
}
