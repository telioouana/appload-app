"use client"

import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { FilterType, SourceType, UserType } from "@/modules/main/ui/types"
import { EmptyOrders } from "@/modules/main/pages/orders/ui/sections/empty-orders"
import { OrdersListSection } from "@/modules/main/pages/orders/ui/sections/orders-list-section"
import { OrdersHeaderSection } from "@/modules/main/pages/orders/ui/sections/orders-header-section"

type Props = {
    userType: UserType
    filter?: FilterType
    source?: SourceType
}

export function OrderLoaderSection({ filter, source, userType }: Props) {
    const trpc = useTRPC()
    const {
        data
    } = useSuspenseInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            filter,
            source,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) return <EmptyOrders userType={userType} />

    return (
        <div className="w-full h-full flex flex-col gap-y-6">
            <div className="flex flex-col gap-4 h-full w-full p-4">
                <OrdersHeaderSection filter={filter} source={source} userType={userType} />

                <OrdersListSection filter={filter} source={source} userType={userType} orders={data.pages.flatMap((page) => page.items)} />
            </div>
        </div>
    )
}
