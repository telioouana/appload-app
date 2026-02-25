"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"
import { IconEdit, IconEye } from "@tabler/icons-react"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { CATEGORIES, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"

import { ORDERS_PATH } from "@/modules/shipper/main/types/types"
import { OrderCard } from "@/modules/shipper/main/ui/card/order-card"
import { EmptyOrders } from "@/modules/shipper/main/ui/states/empty-orders"
import { useOrderDetails } from "@/modules/shipper/main/hooks/use-order-details"
import { OrderDetailsDialog } from "@/modules/shipper/main/ui/dialog/order-details-dialog"
import { OrdersErrorFallback } from "@/modules/shipper/main/ui/states/orders-error-fallback"
import { OrdersLoadingFallback } from "@/modules/shipper/main/ui/states/orders-loading-fallback"

import { cn } from "@/lib/utils"

export function OrdersView({ path }: { path: ORDERS_PATH }) {
    const t = useTranslations("Shipper.main.order.card")

    const { onOpenChange: viewDetails } = useOrderDetails()
    const trpc = useTRPC()

    const {
        data
    } = useSuspenseInfiniteQuery(
        trpc.private.orders.infiniteQueryOptions({
            path,
            limit: DEFAULT_PAGE_LIMIT,
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) return <EmptyOrders />

    return (
        <Suspense fallback={<OrdersLoadingFallback />} >
            <ErrorBoundary fallback={<OrdersErrorFallback />} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full">
                    <OrderDetailsDialog />

                    {data.pages.flatMap((page) =>
                        page.items.map(({ order, cargo, trip, tracking }) => {
                            const values = {
                                order,
                                cargo,
                                trip,
                                tracking
                            }

                            const defaultValues = {
                                loadingAddress: [{
                                    address: order.loadingAddress?.[0]?.address ?? "",
                                    country: order.loadingAddress?.[0]?.country ?? "",
                                    placeId: order.loadingAddress?.[0]?.placeId ?? "",
                                    state: order.loadingAddress?.[0]?.state ?? "",
                                }],
                                offloadingAddress: [{
                                    address: order.offloadingAddress?.[0]?.address ?? "",
                                    country: order.offloadingAddress?.[0]?.country ?? "",
                                    placeId: order.offloadingAddress?.[0]?.placeId ?? "",
                                    state: order.offloadingAddress?.[0]?.state ?? "",
                                }],
                                expectedLoadingDate: order.expectedLoadingDate,
                                expectedOffloadingDate: order.expectedOffloadingDate,
                                expectedTrucks: order.expectedTrucks ?? 1,
                                cargo: {
                                    category: cargo.category as typeof CATEGORIES[number],
                                    description: cargo.description,
                                    quantity: Number(cargo.quantity),
                                    unit: cargo.unit as typeof WEIGHT_UNIT[number],
                                    packing: cargo.packing as typeof PACKING[number],
                                    isHazardous: cargo.isHazardous ?? false,
                                    hazchemCode: cargo.hazchemCode ?? "",
                                    isRefrigerated: cargo.isRefrigerated ?? false,
                                    temperature: Number(cargo.temperature) ?? 0,
                                    temperatureInstructions: cargo.temperatureInstructions ?? "",
                                    isGroupageAllowed: cargo.isGroupageAllowed ?? false
                                },
                                share: order.share as typeof SHARE[number],
                                price: order.price,
                                currency: order.currency
                            }

                            console.log("Default Values", defaultValues)

                            return (
                                <Card key={order.id} className="border border-card hover:border-primary">
                                    <OrderCard values={values} />
                                    <CardFooter className="flex justify-between gap-2 items-center">
                                        <div className="w-full">
                                            <Button
                                                onClick={() => viewDetails(values)}
                                                className={cn("w-full bg-primary/40 hover:bg-primary/80 cursor-pointer font-normal")}
                                            >
                                                <IconEye />
                                                {t("footer.view")}
                                            </Button>
                                        </div>
                                        <div className="w-full">
                                            <Button variant="outline" className="w-full cursor-pointer font-normal">
                                                <IconEdit />
                                                {t("footer.update")}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    )}
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
