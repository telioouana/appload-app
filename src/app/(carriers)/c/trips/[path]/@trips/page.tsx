import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"
import { TripsView } from "@/modules/app/routes/carrier/pages/trips/views/trips-view"

export default async function Page({ params, searchParams }: {
    params: Promise<{ path: TRIPS_PATH }>
    searchParams: Promise<{ search?: string, "cargo-type"?: string }>
}) {
    const { path } = await params
    const { search, "cargo-type": cargoType } = await searchParams

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
            <TripsView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
