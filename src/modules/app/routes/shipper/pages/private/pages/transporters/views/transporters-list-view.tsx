"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"
import { TransportersCard } from "../components/card/transporters-card"

export function TransportersListView() {
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.transporters.transporters.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) return <div />
    
    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error loading"} >
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-6 h-full w-full">
                        {data.pages.flatMap((page) =>
                            page.items.map((values) => {
                                return <TransportersCard key={values.id} values={values} />
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
