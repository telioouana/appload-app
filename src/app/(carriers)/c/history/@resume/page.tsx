import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { HistoryResumeView } from "@/modules/app/routes/carrier/pages/history/views/history-resume-view"

type Props = {
    searchParams: Promise<{ 
        search?: string; 
        "cargo-type"?: string;
    }>
}

export default async function Page({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams
    
    const search = resolvedSearchParams.search?.trim() || undefined
    const cargoType = resolvedSearchParams["cargo-type"]?.trim() || undefined

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.history.resume.queryOptions({
            search,
            cargoType,
        })
    )

    return (
        <HydrateClient>
            <HistoryResumeView search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}