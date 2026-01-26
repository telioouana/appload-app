import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { FilterByType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"

interface Props {
    searchParams: Promise<{
        session: UserType
        filterBy?: FilterByType
    }>
}

export default async function Page({
    searchParams
}: Props) {
    const { session, filterBy } = await searchParams
    
    const client = getQueryClient()
    
    void client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: 8,
            filterBy,
        })
    )

    return (
        <HydrateClient>
            <OrdersView session={session} filterBy={filterBy} />
        </HydrateClient>
    )
}
