import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PrivateOrdersView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/private-orders-view"

type Props = {
    params: Promise<{ path: ORDERS_PATH }>
    searchParams: Promise<{ 
        search?: string; 
        "cargo-type"?: string;
        view?: string; // Good to include if you're using it
    }>
}

export default async function Page({ params, searchParams }: Props) {
    const { path } = await params
    const resolvedSearchParams = await searchParams
    
    const search = resolvedSearchParams.search?.trim() || undefined
    const cargoType = resolvedSearchParams["cargo-type"]?.trim() || undefined

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.private.orders.infiniteQueryOptions({
            path,
            limit: DEFAULT_PAGE_LIMIT,
            search,
            cargoType,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    return (
        <HydrateClient>
            <PrivateOrdersView 
                path={path} 
                search={search} 
                cargoType={cargoType} 
            />
        </HydrateClient>
    )
}