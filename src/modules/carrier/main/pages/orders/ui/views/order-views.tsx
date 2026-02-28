"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"

import { ORDERS_PATH } from "@/modules/carrier/main/types/types"
import { OrderCard } from "@/modules/shipper/main/ui/card/order-card"
import { EmptyOrders } from "@/modules/shipper/main/ui/states/empty-orders"
import { UpdateOrderDialog } from "@/modules/shipper/main/ui/dialog/update-order-dialog"
import { OrderDetailsDialog } from "@/modules/shipper/main/ui/dialog/order-details-dialog"
import { OrdersErrorFallback } from "@/modules/shipper/main/ui/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/shipper/main/ui/states/orders-loading-fallback"

export function OrdersView({ path }: { path: ORDERS_PATH }) {
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.carrierOrder.orders.infiniteQueryOptions({
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
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full">
                        {data.pages.flatMap((page) =>
                            page.items.map(({ order, cargo, trip }) => {
                                const values = {
                                    order,
                                    cargo,
                                    trip,
                                    tracking: null
                                }

                                return <OrderCard key={order.id} values={values} />
                            })
                        )}
                    </div>

                    <InfiniteScroll
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                </div>

            </ErrorBoundary>
        </Suspense>
    )
}
