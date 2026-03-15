import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"
import { TripsView } from "@/modules/app/routes/carrier/pages/trips/views/trips-view"

export default async function Page({ params }: { params: Promise<{ path: TRIPS_PATH }> }) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.trips.all.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            path
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    return (
        <HydrateClient>
            <TripsView path={path} />
        </HydrateClient>
    )
}