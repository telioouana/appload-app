import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PublicResumeView } from "@/modules/app/routes/shipper/pages/public/pages/orders/views/public-resume-view"

type Props = {
    params: Promise<{ path: ORDERS_PATH }>
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
        trpc.public.resume.queryOptions({
            path,
            search,
            cargoType,
        })
    )

    return (
        <HydrateClient>
            <PublicResumeView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
