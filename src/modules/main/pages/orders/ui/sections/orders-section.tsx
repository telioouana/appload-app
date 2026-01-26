"use client"

import { useTranslations } from "next-intl"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"

import { Button } from "@/components/ui/button"

import { OrdersCard } from "@/modules/main/pages/orders/ui/card/orders-card"
import { FilterByType, FilterType, UserType } from "@/modules/main/ui/types"
import { EmptyOrders } from "@/modules/main/pages/orders/ui/sections/empty-orders"
import { CreateOrderDialog } from "@/modules/main/pages/order/ui/dialog/create-order-dialog"

type Props = {
    userType: UserType
    filter?: FilterType
    filterBy?: FilterByType
}

export function OrdersSection({ filter, filterBy, userType }: Props) {
    const t = useTranslations("Main.orders")
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
            filterBy,
            limit: 8,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor
        })
    )

    if (data.pages[0].items.length === 0) return <EmptyOrders userType={userType} />

    return (
        <div className="flex flex-col gap-8 h-full w-full p-4">
            <div className="flex justify-between items-center gap-4">
                <div />

                {userType === "shipper" && (
                    <CreateOrderDialog />
                )}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full w-full">
                {data.pages.flatMap((page) => page.items)
                    .map(({ order, cargo, trip, organizationId, organizationName, fiscalRegime }, index) => {
                        return (
                            <div key={index}>
                                <OrdersCard
                                    trip={trip}
                                    cargo={cargo}
                                    order={order}
                                    organizationId={organizationId}
                                    organizationName={organizationName}
                                    fiscalRegime={fiscalRegime}
                                    filter={filter}
                                    userType={userType}
                                    filterBy={filterBy}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <div className="flex justify-end">
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchPreviousPage()}
                        disabled={!hasPreviousPage || isFetchingPreviousPage}
                    >
                        <IconChevronLeft className="size-4" />
                        {t("pagination.previous")}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                    >
                        {t("pagination.next")}
                        <IconChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
