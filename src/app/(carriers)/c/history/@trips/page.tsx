import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { HistoryView } from "@/modules/app/routes/carrier/pages/history/views/history-view"

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
        trpc.history.all.queryOptions({
            search,
            cargoType,
            limit: DEFAULT_PAGE_LIMIT,
        })
    )

    return (
        <HydrateClient>
            <HistoryView search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
