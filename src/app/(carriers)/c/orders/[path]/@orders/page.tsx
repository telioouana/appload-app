import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"
import { OrdersView } from "@/modules/app/routes/carrier/pages/orders/views/orders-view"

export default async function Page({ params, searchParams }: {
    params: Promise<{ path: ORDERS_PATH }>
    searchParams: Promise<{ search?: string }>
}) {
    const { path } = await params
    const { search } = await searchParams

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            path
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    await client.prefetchQuery(
        trpc.fleet.offer.queryOptions()
    )

    await client.prefetchQuery(
        trpc.driver.offer.queryOptions()
    )

    return (
        <HydrateClient>
            <OrdersView path={path} search={search} />
        </HydrateClient>
    )
}