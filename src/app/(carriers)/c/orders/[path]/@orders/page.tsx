import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"
import { OrdersView } from "@/modules/app/routes/carrier/pages/orders/views/orders-view"

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

    await Promise.all([
        client.prefetchInfiniteQuery(
            trpc.orders.all.infiniteQueryOptions({
                path,
                search,
                cargoType,
                limit: DEFAULT_PAGE_LIMIT,
            }, {
                getNextPageParam: (lastPage) => lastPage.nextCursor
            })
        ),
        client.prefetchQuery(
            trpc.fleet.offer.queryOptions()
        ),
        client.prefetchQuery(
            trpc.driver.offer.queryOptions()
        )
    ])

    return (
        <HydrateClient>
            <OrdersView path={path} search={search} cargoType={cargoType} />
        </HydrateClient>
    )
}
