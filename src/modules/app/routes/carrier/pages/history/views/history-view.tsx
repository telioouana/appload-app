"use client"

import { Suspense, useMemo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"

import { TripCard } from "../../../ui/components/card/trip-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"


export function HistoryView({ search, cargoType }: { search?: string, cargoType?: string }) {
    const trpc = useTRPC()

    const {
        data: history,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.history.all.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    const filteredHistory = useMemo(() => {
        const cargoRaw = (cargoType ?? "").trim()
        const cargoFilter = cargoRaw === "" ? null : cargoRaw.toLowerCase()
        const raw = (search ?? "").trim()
        const items = history.pages.flatMap((page) => page.items)
        if (raw === "" && cargoFilter == null) return items
        // keep items that matched cargo filter when search is empty
        if (raw === "") return items.filter((it) => {
            if (cargoFilter == null) return true
            const cat = (it.cargo?.category ?? "").toLowerCase()
            return cat === cargoFilter
        })

        const q = raw.toLowerCase()

        return items.filter(({ order, trip, cargo }) => {
            if (cargoFilter != null) {
                const cat = (cargo?.category ?? "").toLowerCase()
                if (cat !== cargoFilter) return false
            }
            const loadingState = order.loadingAddress?.[0]?.state?.toLowerCase()
            const offloadingState = order.offloadingAddress?.[0]?.state?.toLowerCase()
            const driverName = trip.driverName?.toLowerCase()
            const truckPlate = trip.truckPlate?.toLowerCase()

            const legacyId = trip.legacyId?.toString()

            return (
                loadingState?.includes(q) ||
                offloadingState?.includes(q) ||
                driverName?.includes(q) ||
                truckPlate?.includes(q) ||
                legacyId === raw ||
                legacyId?.padStart(4, "0") === raw
            )
        })
    }, [history.pages, search, cargoType])

    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-6 h-full w-full">
                        {filteredHistory.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyOrders />
                            </div>
                        ) : (
                            filteredHistory.map(({ order, cargo, trip, location }) => {
                                const values = {
                                    trip,
                                    order,
                                    cargo,
                                    tracking: location,
                                }

                                return <TripCard key={trip.id} values={values}/>
                            })
                        )}
                    </div>

                    {filteredHistory.length > 0 && (
                        <InfiniteScroll
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                        />
                    )}
                </div>

            </ErrorBoundary>
        </Suspense>
    )
}
