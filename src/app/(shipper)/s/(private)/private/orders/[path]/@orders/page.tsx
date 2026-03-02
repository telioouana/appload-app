import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { OrdersView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/orders-view"


export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.private.orders.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            path
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    return (
        <HydrateClient>
            <OrdersView path={path} />
        </HydrateClient>
    )
}