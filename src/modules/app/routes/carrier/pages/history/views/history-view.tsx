"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { HistorySection } from "../sections/history-section"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"

export function HistoryView({ search, cargoType }: { search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <HistorySection
                    search={search}
                    cargoType={cargoType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
