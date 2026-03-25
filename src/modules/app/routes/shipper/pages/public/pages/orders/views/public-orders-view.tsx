"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { SHARE } from "@/backend/db/types";

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"
import { UpdateOrderDialog } from "@/modules/app/routes/shipper/ui/components/dialog/update-order-dialog"
import { OrderDetailsDialog } from "@/modules/app/routes/shipper/ui/components/dialog/order-details-dialog"
import { PublicOrdersSection } from "@/modules/app/routes/shipper/pages/public/pages/orders/section/public-orders-section"
import { OffersListSheet } from "@/modules/app/routes/shipper/ui/components/sheet/offers-list-sheet";

export function PublicOrdersView({ path, search, cargoType }: { path: ORDERS_PATH, search?: string, cargoType?: string }) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <OrderDetailsDialog />
                <OffersListSheet path={path} search={search} cargoType={cargoType} />
                <UpdateOrderDialog path={path} share={SHARE[0]} search={search} cargoType={cargoType} />

                <PublicOrdersSection path={path} search={search} cargoType={cargoType} />
            </ErrorBoundary>
        </Suspense>
    )
}
