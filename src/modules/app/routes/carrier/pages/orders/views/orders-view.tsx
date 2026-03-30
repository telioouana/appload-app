"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ORDERS_PATH } from "../../../types/types"
import { OrdersSection } from "../section/orders-section"
import { AcceptOrderDialog } from "../../../ui/components/dialog/accept-order-dialog"
import { CreateOfferDialog } from "../../../ui/components/dialog/create-offer-dialog"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"
import { OrderDetailsDialog } from "../../../ui/components/dialog/order-details-dialog"

export function OrdersView({ path, search, cargoType }: { path: ORDERS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <AcceptOrderDialog path={path} search={search} cargoType={cargoType} />
                <CreateOfferDialog path={path} search={search} cargoType={cargoType} />
                <OrderDetailsDialog />

                <OrdersSection path={path} search={search} cargoType={cargoType} />
            </ErrorBoundary>
        </Suspense>
    )
}
