"use-client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"
import { useTRPC } from "@/backend/trpc/client"
import { InfiniteScroll } from "@/components/customs/scroll"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"
import { OrderCard } from "@/modules/app/routes/shipper/ui/components/card/order-card"

interface OrdersSectionProps {
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}

export function PublicOrdersSection({ path, search, cargoType }: OrdersSectionProps) {
    const trpc = useTRPC()

    // 1. Fetch data from the server using the filters. 
    // This ensures we search the entire database, not just loaded items.
    const {
        data: orders,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.public.orders.infiniteQueryOptions({
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

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {items.length === 0 ? (
                    <div className="col-span-full py-10">
                        {/* Pass the search state to the empty component */}
                        <EmptyOrders isSearch={isSearching} />
                    </div>
                ) : (
                    items.map((values) => (
                        <OrderCard
                            key={values.order.id}
                            values={values}
                            path={path}
                            search={search}
                            cargoType={cargoType}
                        />
                    ))
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