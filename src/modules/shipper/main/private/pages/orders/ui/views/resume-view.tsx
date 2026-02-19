"use client"

import { Suspense } from "react"
import { IconPackage } from "@tabler/icons-react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"

import { useTRPC } from "@/backend/trpc/client"

import { Card, CardContent } from "@/components/ui/card"

import { ORDERS_PATH } from "@/modules/shipper/main/types/types"

export function ResumeView({ path }: { path: ORDERS_PATH }) {
    const t = useTranslations(`Shipper.main.private.marketplace.resume`)
    const f = useFormatter()

    const trpc = useTRPC()
    const {
        data: {
            orders,
            total,
            average,
        }
    } = useSuspenseQuery(
        trpc.private.resume.queryOptions({
            path
        })
    )

    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full w-full">
                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex gap-3 items-center">
                                <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                                    <IconPackage className="8 text-primary" />
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
                                    <IconPackage className="8 text-primary" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-2xl font-semibold leading-tight">
                                        {f.number(total, {
                                            currency: "MZN",
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
                                    <IconPackage className="8 text-primary" />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <p className="text-2xl font-semibold leading-tight">
                                        {f.number(average, {
                                            currency: "MZN",
                                            currencyDisplay: "code",
                                            currencySign: "accounting",
                                            compactDisplay: "long"
                                        })}
                                    </p>
                                    <p className="text-muted-foreground">{t("average")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
