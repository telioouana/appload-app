import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"
import { TripsResumeView } from "@/modules/app/routes/carrier/pages/trips/views/trips-resume-view"

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
        trpc.trips.resume.queryOptions({
            path,
            search,
            cargoType,
        })
    )

    return (
        <HydrateClient>
            <TripsResumeView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
