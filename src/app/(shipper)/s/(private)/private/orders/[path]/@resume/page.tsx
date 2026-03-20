import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PrivateResumeView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/private-resume-view"

type Props = {
    params: Promise<{ path: ORDERS_PATH }>
    searchParams: Promise<{ 
        search?: string; 
        "cargo-type"?: string;
    }>
}

export default async function Page({ params, searchParams }: Props) {
    // 1. Await the promises (Required in Next.js 15)
    const { path } = await params
    const resolvedSearchParams = await searchParams
    
    const search = resolvedSearchParams.search?.trim() || undefined
    const cargoType = resolvedSearchParams["cargo-type"]?.trim() || undefined

    const client = getQueryClient()

    // 2. Prefetch so the client finds the data in the cache immediately
    await client.prefetchQuery(
        trpc.private.resume.queryOptions({
            path,
            search,
            cargoType,
        })
    )

    return (
        <HydrateClient>
            <PrivateResumeView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
