import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { FilterByType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"
import { auth } from "@/backend/auth"

interface Props {
    searchParams: Promise<{
        filterBy?: FilterByType
    }>
}

export default async function Page({
    searchParams
}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    const { user: { type: sessionType } } = session
    const { filterBy } = await searchParams

    const userType = sessionType as UserType

    const client = getQueryClient()

    void client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: 8,
            filterBy,
        })
    )

    return (
        <HydrateClient>
            <OrdersView userType={userType} filterBy={filterBy} />
        </HydrateClient>
    )
}
