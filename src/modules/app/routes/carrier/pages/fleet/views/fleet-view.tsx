"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { FLEET_STATUS } from "@/backend/db/types"

import { LAYOUT_VIEW } from "../../../types/types"
import { InfiniteScroll } from "@/components/customs/scroll"
import { ListCard } from "../components/card/list-card"
import { GridCard } from "../components/card/grid-card"

interface Props {
    status: typeof FLEET_STATUS[number] | undefined
    view: LAYOUT_VIEW | undefined
}

export function FleetView({ status, view }: Props) {
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.fleet.fleet.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            status,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) return <div />

    return (
        <Suspense fallback={"Loading..."}>
            <ErrorBoundary fallback={"Error fetching"}>
                <div className="flex flex-col">
                    {(!view || view === "list")
                        ? (
                            <div className="grid grid-rows-1 w-full gap-4">
                                {data.pages.flatMap((page) =>
                                    page.items.map(({ driver, user, truck, trip, tracking }) => {
                                        return <ListCard key={driver.id} />
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.pages.flatMap((page) =>
                                    page.items.map(({ driver, user, truck, trip, tracking }) => {
                                        return <GridCard key={driver.id} />
                                    })
                                )}
                            </div>
                        )
                    }

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
