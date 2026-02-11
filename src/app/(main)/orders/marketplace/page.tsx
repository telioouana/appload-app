import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { SourceType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    const { user: { type: sessionType } } = session

    const userType: UserType | undefined = sessionType === "shipper" || sessionType === "carrier"
        ? sessionType
        : undefined

    if (!userType) {
        await auth.api.signOut()
        return redirect("/sign-in")
    }

    const source: SourceType | undefined = "private"

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: 8,
            source
        })
    )

    return (
        <HydrateClient>
            <OrdersView userType={userType} source={source} />
        </HydrateClient>
    )
}