import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { MapView } from "@/modules/app/routes/carrier/pages/map/views/map-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.carrierMap.positions.queryOptions()
    )
    return (
        <HydrateClient>
            <MapView />
        </HydrateClient>
    )
}
