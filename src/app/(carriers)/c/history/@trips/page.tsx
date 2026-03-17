import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { HistoryView } from "@/modules/app/routes/carrier/pages/history/views/history-view"

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ search?: string, "cargo-type"?: string }>
}) {
    const { search, "cargo-type": cargoType } = await searchParams

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.history.all.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    return (
        <HydrateClient>
            <HistoryView search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
