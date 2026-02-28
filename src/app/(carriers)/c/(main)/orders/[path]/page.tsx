import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { ORDERS_PATH } from "@/modules/carrier/main/types/types"
import { OrdersView } from "@/modules/carrier/main/pages/orders/ui/views/order-views"

interface Props {
    params: Promise<{ path: ORDERS_PATH }>
}

export default async function page({ params }: Props) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.carrierOrder.orders.infiniteQueryOptions({
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
