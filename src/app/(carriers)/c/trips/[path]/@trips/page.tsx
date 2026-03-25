import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"
import { TripsView } from "@/modules/app/routes/carrier/pages/trips/views/trips-view"

type Props = {
    params: Promise<{ path: TRIPS_PATH }>
    searchParams: Promise<{ 
        search?: string; 
        "cargo-type"?: string;
    }>
}

export default async function Page({ params, searchParams }: Props) {
    const { path } = await params
    const resolvedSearchParams = await searchParams
    
    const search = resolvedSearchParams.search?.trim() || undefined
    const cargoType = resolvedSearchParams["cargo-type"]?.trim() || undefined

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.trips.all.queryOptions({
            path,
            search,
            cargoType,
            limit: DEFAULT_PAGE_LIMIT,
        })
    )
    
    return (
        <HydrateClient>
            <TripsView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
