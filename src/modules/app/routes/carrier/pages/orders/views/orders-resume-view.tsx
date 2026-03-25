"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ORDERS_PATH } from "../../../types/types"
import { OrdersResumeSection } from "../section/orders-resume-section"

export function OrdersResumeView({ path, search, cargoType }: { path: ORDERS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <OrdersResumeSection path={path} search={search} cargoType={cargoType} />
            </ErrorBoundary>
        </Suspense>
    )
}
