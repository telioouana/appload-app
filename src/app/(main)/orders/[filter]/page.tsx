import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { FilterByType, FilterType, UserType } from "@/modules/main/ui/types"
import { OrdersView } from "@/modules/main/pages/orders/ui/views/orders-view"
import { auth } from "@/backend/auth"

interface Props {
    params: Promise<{ filter: FilterType }>
    searchParams: Promise<{ filterBy?: FilterByType }>
}

export default async function Page({
    params,
    searchParams
}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    const { user: { type: sessionType } } = session
    const { filterBy: rawFilterBy } = await searchParams

    const filterBy = Array.isArray(rawFilterBy) ? rawFilterBy[0] : rawFilterBy
    // Validate against FilterByType union values; set to undefined if invalid
    const validFilterBy = filterBy && ["booked", "at-loading", "loading", "waiting-documents", "in-transit", "stopped", "at-border", "completed"].includes(filterBy as string)
        ? (filterBy as FilterByType)
        : undefined

    const { filter } = await params

    const userType: UserType | undefined = sessionType === "shipper" || sessionType === "carrier"
        ? sessionType
        : undefined

    if (!userType) {
        await auth.api.signOut()
        return redirect("/sign-in")
    }

    const client = getQueryClient()

    await client.prefetchInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            limit: 8,
            filter,
            filterBy: validFilterBy,
        })
    )

    return (
        <HydrateClient>
            <OrdersView userType={userType} filter={filter} filterBy={validFilterBy} />
        </HydrateClient>
    )
}
