"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/shipper/main/types/types"
import { OrderCard } from "@/modules/shipper/main/ui/card/order-card"
import { EmptyOrders } from "@/modules/shipper/main/ui/states/empty-orders"
import { OrdersErrorFallback } from "@/modules/shipper/main/ui/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/shipper/main/ui/states/orders-loading-fallback"

export function OrdersView({ path }: { path: ORDERS_PATH }) {
    const trpc = useTRPC()
    const {
        data
    } = useSuspenseInfiniteQuery(
        trpc.private.orders.infiniteQueryOptions({
            path,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) return <EmptyOrders />

    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full">
                    {data.pages.flatMap((page) =>
                        page.items.map(({ order, cargo, trip }) => (
                            <OrderCard
                                key={order.id}
                                cargo={cargo}
                                order={order}
                                trip={trip}
                                path={path}
                            />
                        ))
                    )}
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
