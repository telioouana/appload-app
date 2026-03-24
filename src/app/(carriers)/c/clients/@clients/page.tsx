import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ClientsView } from "@/modules/app/routes/carrier/pages/clients/views/clients-view";

import { DEFAULT_PAGE_LIMIT } from "@/constants";

export default async function Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.clients.clients.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    const { search } = await searchParams

    return (
        <HydrateClient>
            <ClientsView search={search} />
        </HydrateClient>
    )
}
