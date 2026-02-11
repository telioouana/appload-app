import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { FilterType, SourceType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"

interface Props {
    params: Promise<{ filter: FilterType }>
}

export default async function Page({
    params,
}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    const { user: { type: sessionType } } = session

    const { filter } = await params

    const source: SourceType | undefined = "private"

    const userType: UserType | undefined = sessionType === "shipper" || sessionType === "carrier"
        ? sessionType
        : undefined

    if (!userType) {
        await auth.api.signOut({
            headers: await headers()
        })
        return redirect("/sign-in")
    }

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            filter,
            source,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    return (
        <HydrateClient>
            <OrdersView userType={userType} filter={filter} source={source} />
        </HydrateClient>
    )
}