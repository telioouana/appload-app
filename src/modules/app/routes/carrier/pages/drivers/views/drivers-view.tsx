"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { FLEET_STATUS } from "@/backend/db/types"

import { InfiniteScroll } from "@/components/customs/scroll"

import { LAYOUT_VIEW } from "../../../types/types"
import { ListCard } from "../components/card/list-card"
import { GridCard } from "../components/card/grid-card"

interface Props {
    status: typeof FLEET_STATUS[number] | undefined
    view: LAYOUT_VIEW | undefined
}

export function DriversView({ status, view }: Props) {
    const trpc = useTRPC()

    const {
        data: drivers,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.driver.drivers.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            status,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (drivers.pages[0].items.length === 0) return <div />

    return (
        <Suspense fallback={"Loading..."}>
            <ErrorBoundary fallback={"Error fetching"}>
                <div className="flex flex-col">
                    {(!view || view === "list")
                        ? (
                            <div className="grid grid-rows-1 w-full gap-4">
                                {drivers.pages.flatMap((page) =>
                                    page.items.map(({ driver, user, truck, tracking }) => {
                                        const values = {
                                            driver,
                                            user,
                                            truck,
                                            tracking
                                        }
                                        return <ListCard key={driver.id} values={values} />
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {drivers.pages.flatMap((page) =>
                                    page.items.map(({ driver, user, truck, tracking }) => {
                                        const values = {
                                            driver,
                                            user,
                                            truck,
                                            tracking
                                        }
                                        return <GridCard key={driver.id} values={values} />
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
