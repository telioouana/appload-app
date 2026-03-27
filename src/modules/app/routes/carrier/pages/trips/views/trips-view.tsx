"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { TRIPS_PATH } from "../../../types/types"
import { TripsSection } from "../sections/trips-section"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"
import { ManageTripDialog } from "../../../ui/components/dialog/manage-trip-dialog"

export function TripsView({ path, search, cargoType }: { path: TRIPS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
            <ManageTripDialog path={path} search={search} cargoType={cargoType} />
                <TripsSection
                    path={path}
                    search={search}
                    cargoType={cargoType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
