"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { SHARE } from "@/backend/db/types";

import { InfiniteScroll } from "@/components/customs/scroll"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { OrderCard } from "@/modules/app/routes/shipper/ui/components/card/order-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"
import { UpdateOrderDialog } from "@/modules/app/routes/shipper/ui/components/dialog/update-order-dialog"
import { OrderDetailsDialog } from "@/modules/app/routes/shipper/ui/components/dialog/order-details-dialog"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"

export function OrdersView({ path }: { path: ORDERS_PATH }) {
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.public.orders.infiniteQueryOptions({
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
                        <OrderDetailsDialog />
                        <UpdateOrderDialog path={path} share={SHARE[0]} />

                        {data.pages.flatMap((page) =>
                            page.items.map(({ order, cargo, trip, tracking }) => {
                                const values = {
                                    order,
                                    cargo,
                                    trip,
                                    tracking
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
