"use client"

import { Suspense, useMemo } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"

import { InfiniteScroll } from "@/components/customs/scroll"
import { ClientCard } from "../components/card/client-card"

export function ClientsView({ search }: { search?: string }) {
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.clients.clients.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    const raw = (search ?? "").trim()

    const items = data.pages.flatMap((page) => page.items)

    // Compute filteredItems with a hook unconditionally so hooks order is stable
    const filteredItems = useMemo(() => {
        if (raw === "") return items
        const q = raw.toLowerCase()
        return items.filter((values) => {
            const candidates: Array<string | undefined> = [values.name, values.address?.state]
            return candidates.some((c) => c && c.toLowerCase().includes(q))
        })
    }, [items, raw])

    // If there are no items at all, render a small placeholder (do not change hook ordering)
    if (items.length === 0) return <div />

    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error loading"} >
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-6 h-full w-full">
                        {filteredItems.map((values) => {
                            return <ClientCard key={values.id} values={values} />
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
