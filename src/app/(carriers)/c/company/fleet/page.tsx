import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { HeaderView } from "@/modules/app/routes/carrier/pages/fleet/views/header-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.driver.offer.queryOptions()
    )
    
    return (
        <HydrateClient>
            <HeaderView />
        </HydrateClient>
    )
}