import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { FilterByType, FilterType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"

interface Props {
    params: Promise<{ filter: FilterType }>
    searchParams: Promise<{ session: UserType, filterBy?: FilterByType }>
}

export default async function Page({
    params,
    searchParams
}: Props) {
    const { filter } = await params
    const { session, filterBy } = await searchParams

    const client = getQueryClient()

    void client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: 8,
            filter,
            filterBy,
        })
    )

    return (
        <HydrateClient>
            <OrdersView session={session} filter={filter} filterBy={filterBy} />
        </HydrateClient>
    )
}
