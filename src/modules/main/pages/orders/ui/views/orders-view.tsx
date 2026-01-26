import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ErrorFallback } from "@/modules/main/ui/states/failed"
import { FilterByType, FilterType, UserType } from "@/modules/main/ui/types"
import { OrdersSection } from "@/modules/main/pages/orders/ui/sections/orders-section"
import { OrdersLoadingFallback } from "@/modules/main/ui/states/orders-loading-fallback"

type Props = {
    userType: UserType
    filter?: FilterType
    filterBy?: FilterByType
}

export function OrdersView({ filter, filterBy, userType }: Props) {
    return (
        <Suspense fallback={<OrdersLoadingFallback />}>
            <ErrorBoundary fallback={<ErrorFallback />}>
                <div className="w-full h-full flex flex-col gap-y-6">
                    <OrdersSection filter={filter} filterBy={filterBy} userType={userType}/>
                </div>
            </ErrorBoundary>
        </Suspense>   
    )
}
