import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ClientsView } from "@/modules/app/routes/carrier/pages/clients/views/clients-view";

import { DEFAULT_PAGE_LIMIT } from "@/constants";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.clients.clients.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        })
    )

    return (
        <HydrateClient>
            <ClientsView />
        </HydrateClient>
    )
}
