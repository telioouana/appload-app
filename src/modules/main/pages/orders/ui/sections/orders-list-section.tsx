"use client"

import { cargo, order, trip } from "@/backend/db/schema";

import { OrdersCard } from "@/modules/main/ui/card/orders-card"
import { FilterType, SourceType, UserType } from "@/modules/main/ui/types"

type Props = {
    userType: UserType
    orders: {
        cargo: typeof cargo.$inferSelect
        order: typeof order.$inferSelect
        trip: typeof trip.$inferSelect | null
        organizationId: string
        organizationName: string
        fiscalRegime: string | null
    }[]
    filter?: FilterType
    source?: SourceType
}

export function OrdersListSection({ filter, source, orders, userType }: Props) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full w-full">
            {orders.map(({ order, cargo, trip, organizationId, organizationName, fiscalRegime }) => {
                const defaultValues = {
                    order: order,
                    cargo: cargo,
                    trip: trip,
                    organizationId: organizationId,
                    organizationName: organizationName,
                    fiscalRegime: fiscalRegime
                }
                return (
                    <OrdersCard
                        key={order.id}
                        filter={filter}
                        source={source}
                        userType={userType}
                        defaultValues={defaultValues}
                    />
                )
            })}
        </div>
    )
}