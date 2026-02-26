import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import MapView from "@/modules/shipper/main/public/pages/map/ui/views/map-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.map.positions.queryOptions()
    )
    return (
        <HydrateClient>
            <MapView />
        </HydrateClient>
    )
}
