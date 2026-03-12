"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { FISCAL_REGIME } from "@/backend/db/types"

import { InfiniteScroll } from "@/components/customs/scroll"

import { ORDERS_PATH } from "../../../types/types"
import { OrderCard } from "../../../ui/components/card/order-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"
import { AcceptOrderDialog } from "../../../ui/components/dialog/accept-order-dialog"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"
import { CreateOfferDialog } from "../../../ui/components/dialog/create-offer-dialog"


export function OrdersView({ path }: { path: ORDERS_PATH }) {
    const trpc = useTRPC()

    const {
        data: orders,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            path,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    const {
        data: fleet
    } = useSuspenseQuery(
        trpc.fleet.offer.queryOptions()
    )

    const {
        data: drivers
    } = useSuspenseQuery(
        trpc.driver.offer.queryOptions()
    )

    if (orders.pages[0].items.length === 0) return <EmptyOrders />

    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <AcceptOrderDialog path={path} />
                <CreateOfferDialog />

                <div className="flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full">
                        {orders.pages.flatMap((page) =>
                            page.items.map(({ order, cargo, organizationId, organizationName, fiscalRegime }) => {
                                const values = {
                                    fleet,
                                    order,
                                    cargo,
                                    drivers,
                                    organizationId,
                                    organizationName,
                                    fiscalRegime: fiscalRegime as typeof FISCAL_REGIME[number]
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
