"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"
import { IconCashBanknote, IconPackage, IconRoute } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"

import { Card, CardContent } from "@/components/ui/card"

import { ORDERS_PATH } from "../../../types/types"

export function ResumeView({ path }: { path: ORDERS_PATH }) {
    const t = useTranslations(`Carrier.marketplace.orders.resume`)
    const f = useFormatter()

    const trpc = useTRPC()
    const {
        data: {
            orders,
            total,
            distance,
        }
    } = useSuspenseQuery(
        trpc.orders.resume.queryOptions({
            path
        })
    )

    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex gap-3 items-center">
                                <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                                    <IconPackage className="size-8 text-primary" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-2xl font-semibold leading-tight">{orders}</p>
                                    <p className="text-muted-foreground">{t("orders")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex gap-3 items-center">
                                <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                                    <IconCashBanknote className="size-8 text-primary" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-2xl font-semibold leading-tight">
                                        {f.number(total, {
                                            currency: "MZN",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                            currencyDisplay: "code",
                                            currencySign: "accounting",
                                            compactDisplay: "long"
                                        })}
                                    </p>
                                    <p className="text-muted-foreground">{t("total")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex gap-3 items-center">
                                <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                                    <IconRoute className="size-8 text-primary" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-2xl font-semibold leading-tight">
                                        {f.number(distance, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </p>
                                    <p className="text-muted-foreground">{t("distance")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
