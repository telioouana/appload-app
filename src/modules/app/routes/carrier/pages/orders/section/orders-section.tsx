"use client"

import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { FISCAL_REGIME } from "@/backend/db/types"

import { InfiniteScroll } from "@/components/customs/scroll"

import { ORDERS_PATH } from "../../../types/types"
import { OrderCard } from "../../../ui/components/card/order-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"

interface Props {
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}

export function OrdersSection({ path, search, cargoType }: Props) {
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
            search: search?.trim() || undefined,
            cargoType: cargoType?.trim() || undefined,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    // 2. Simply flatten the pages. No useMemo filtering needed!
    const items = orders.pages.flatMap((page) => page.items)

    // 3. Determine if the user is currently filtering/searching
    const isSearching = !!(search?.trim() || cargoType?.trim())

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

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {items.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyOrders isSearch={isSearching} />
                    </div>
                ) : (
                    items.map(({ order, cargo, offer, organizationId, organizationName, fiscalRegime }) => {
                        const values = {
                            fleet,
                            order,
                            cargo,
                            offer,
                            drivers,
                            organizationId,
                            organizationName,
                            fiscalRegime: fiscalRegime as typeof FISCAL_REGIME[number]
                        }

                        return <OrderCard key={order.id} values={values} />
                    })
                )}
            </div>

            {items.length > 0 && (
                <InfiniteScroll
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}
        </div>
    )
}