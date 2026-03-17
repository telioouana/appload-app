import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { TransportersView } from "@/modules/app/routes/shipper/pages/private/pages/transporters/views/transporters-view";

import { DEFAULT_PAGE_LIMIT } from "@/constants";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.transporters.transporters.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    return (
        <HydrateClient>
            <TransportersView />
        </HydrateClient>
    )
}
