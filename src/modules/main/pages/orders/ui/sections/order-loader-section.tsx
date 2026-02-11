"use client"

import { useTranslations } from "next-intl"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"

import { Button } from "@/components/ui/button"

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
    const t = useTranslations("Main.orders.pagination")

    const trpc = useTRPC()
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useSuspenseInfiniteQuery(
        trpc.orders.all.infiniteQueryOptions({
            filter,
            source,
            limit: 8,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    if (data.pages[0].items.length === 0) return <EmptyOrders userType={userType} />

    return (
        <div className="w-full h-full flex flex-col gap-y-6">
            <div className="flex flex-col gap-4 h-full w-full p-4">
                <OrdersHeaderSection filter={filter} source={source} userType={userType} />

                <OrdersListSection filter={filter} source={source} userType={userType} orders={data.pages.flatMap(page => page.items)} />

                <div className="flex justify-end">
                    <div className="flex items-center gap-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchPreviousPage()}
                            disabled={!hasPreviousPage || isFetchingPreviousPage}
                        >
                            <IconChevronLeft className="size-4" />
                            {t("previous")}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {t("next")}
                            <IconChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
