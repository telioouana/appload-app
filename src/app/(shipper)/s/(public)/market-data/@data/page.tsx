import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { DataView } from "@/modules/app/routes/shipper/pages/market-data/views/data-view";

import { DEFAULT_PAGE_LIMIT } from "@/constants";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.market.history.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    return (
        <HydrateClient>
            <DataView />
        </HydrateClient>
    )
}
