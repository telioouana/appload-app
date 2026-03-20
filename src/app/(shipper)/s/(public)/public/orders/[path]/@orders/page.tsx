import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PublicOrdersView } from "@/modules/app/routes/shipper/pages/public/pages/orders/views/public-orders-view"

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
        trpc.public.orders.infiniteQueryOptions({
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
            <PublicOrdersView 
                path={path} 
                search={search} 
                cargoType={cargoType} 
            />
        </HydrateClient>
    )
}