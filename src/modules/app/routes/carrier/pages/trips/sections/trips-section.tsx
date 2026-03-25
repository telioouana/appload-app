"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"

import { TRIPS_PATH } from "../../../types/types"
import { TripCard } from "../../../ui/components/card/trip-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"

interface Props {
    path: TRIPS_PATH
    search?: string
    cargoType?: string
}

export function TripsSection({ path, search, cargoType }: Props) {
    const trpc = useTRPC()

    const {
        data: orders,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.trips.all.infiniteQueryOptions({
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
        <div className="flex flex-col">
            <div className="grid grid-cols-1 gap-6 h-full w-full">
                {items.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyOrders isSearch={isSearching} />
                    </div>
                ) : (
                    items.map((values) => {
                        return <TripCard key={values.trip.id} values={values} />
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