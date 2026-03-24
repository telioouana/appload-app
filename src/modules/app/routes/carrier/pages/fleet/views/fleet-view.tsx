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
    search?: string
}

export function FleetView({ status, view, search }: Props) {
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

    // Flatten all pages into a single items array for filtering
    const items = data.pages.flatMap((page) => page.items)

    if (items.length === 0) return <div />

    // Normalize search and compute filtered list
    const raw = (search ?? "").trim()
    const filteredItems = raw === "" ? items : (() => {
        const q = raw.toLowerCase()
        return items.filter(({ user, truck, trailer, link }) => {
            // candidate fields: user.name, truck internalId/regPlate, trailer internalId/regPlate, link internalId/regPlate
            const candidates: Array<string | undefined> = [
                user?.name,
                truck?.internalId ?? truck?.regPlate,
                trailer?.internalId ?? trailer?.regPlate,
                link?.internalId ?? link?.regPlate,
            ]

            return candidates.some((v) => v && v.toLowerCase().includes(q))
        })
    })()

    return (
        <Suspense fallback={"Loading..."}>
            <ErrorBoundary fallback={"Error fetching"}>
                <div className="flex flex-col">
                    {(!view || view === "list")
                        ? (
                            <div className="grid grid-rows-1 w-full gap-4">
                                {filteredItems.map(({ driver, user, truck, tracking, trailer, link }) => {
                                    const values = {
                                        truck,
                                        trailer,
                                        link,
                                        driver,
                                        user,
                                        tracking
                                    }
                                    return <ListCard key={truck.id} values={values} />
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.map(({ driver, user, truck, tracking, trailer, link }) => {
                                    const values = {
                                        truck,
                                        trailer,
                                        link,
                                        driver,
                                        user,
                                        tracking
                                    }
                                    return <GridCard key={truck.id} values={values} />
                                })}
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
