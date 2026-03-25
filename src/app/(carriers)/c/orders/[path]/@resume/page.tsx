import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"
import { OrdersResumeView } from "@/modules/app/routes/carrier/pages/orders/views/orders-resume-view"

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
        trpc.orders.resume.queryOptions({
            path,
            search,
            cargoType,
        })
    )

    return (
        <HydrateClient>
            <OrdersResumeView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
