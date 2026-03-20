"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "next-intl"

import { useTRPC } from "@/backend/trpc/client"

import { Card, CardContent } from "@/components/ui/card"

export function TransportersResumeView() {
    const t = useTranslations("Shipper.private.transporters.resume")
    const f = useFormatter()

    const trpc = useTRPC()

    const {
        data: {
            transporters,
            trips,
            paid
        }
    } = useSuspenseQuery(
        trpc.transporters.resume.queryOptions()
    )

    return (
        <Suspense fallback={"Loading..."} >
            <ErrorBoundary fallback={"Error fetching"} >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-muted-foreground text-xs">{t("transporters")}</p>
                                <p className="text-2xl font-light leading-tight">{transporters}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-muted-foreground text-xs">{t("trips")}</p>
                                <p className="text-2xl font-light leading-tight">{trips}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="px-0 py-4">
                        <CardContent>
                            <div className="flex flex-col gap-1.5">
                                <p className="text-muted-foreground text-xs">{t("paid")}</p>
                                <p className="text-2xl font-light leading-tight">
                                    {f.number(paid, {
                                        currency: "MZN",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        currencyDisplay: "code",
                                        currencySign: "accounting",
                                        compactDisplay: "long"
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
