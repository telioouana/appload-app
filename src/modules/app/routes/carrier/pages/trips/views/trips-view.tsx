"use client"

import { Suspense, useMemo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"

import { TRIPS_PATH } from "../../../types/types"
import { TripCard } from "../../../ui/components/card/trip-card"
import { EmptyOrders } from "@/modules/app/ui/components/states/empty-orders"
import { OrdersErrorFallback } from "@/modules/app/ui/components/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/app/ui/components/states/orders-loading-fallback"


export function TripsView({ path, search }: { path: TRIPS_PATH, search?: string }) {
    const trpc = useTRPC()

    const {
        data: trips,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.trips.all.infiniteQueryOptions({
            path,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (trips.pages[0].items.length === 0) return <EmptyOrders />

    const filteredTrips = useMemo(() => {
        const items = trips.pages.flatMap((page) => page.items)
        const raw = (search ?? "").trim()
        if (raw === "") return items

        const q = raw.toLowerCase()

        return items.filter(({ order, trip }) => {
            const loadingState = order.loadingAddress?.[0]?.state?.toLowerCase()
            const offloadingState = order.offloadingAddress?.[0]?.state?.toLowerCase()

            const driverName = trip.driverName?.toLowerCase()
            const truckPlate = trip.truckPlate?.toLowerCase()

            const legacyId = trip.legacyId?.toString()
            const legacyIdPadded = legacyId?.padStart(4, "0")

            return (
                (loadingState?.includes(q) ?? false) ||
                (offloadingState?.includes(q) ?? false) ||
                (driverName?.includes(q) ?? false) ||
                (truckPlate?.includes(q) ?? false) ||
                legacyId === raw ||
                legacyIdPadded === raw
            )
        })
    }, [trips.pages, search])

    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-6 h-full w-full">
                        {filteredTrips.map(({ order, cargo, trip, location }) => {
                            const values = {
                                trip,
                                order,
                                cargo,
                                tracking: location,
                            }

                            return <TripCard key={trip.id} values={values}/>
                        })}
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
