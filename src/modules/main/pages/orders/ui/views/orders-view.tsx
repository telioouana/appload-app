"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { FilterType, SourceType, UserType } from "@/modules/main/ui/types"
import { OrdersErrorFallback } from "@/modules/main/ui/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/main/ui/states/orders-loading-fallback"
import { OrderLoaderSection } from "@/modules/main/pages/orders/ui/sections/order-loader-section"

type Props = {
    userType: UserType
    filter?: FilterType
    source?: SourceType
}

export function OrdersView({ filter, source, userType }: Props) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />}>
            <ErrorBoundary fallback={<OrdersErrorFallback />}>
                <OrderLoaderSection filter={filter} source={source} userType={userType} />
            </ErrorBoundary>
        </Suspense>
    )
}
