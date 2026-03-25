"use client"

import { useFormatter } from "next-intl"
import { IconCashBanknote, IconPackage, IconRoute } from "@tabler/icons-react"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
    distance: number
    global: number
    total: number
    t: (key: string) => string
}

export function OrdersResumeCardView({
    distance,
    global,
    total,
    t
}: Props) {
    const f = useFormatter()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <Card className="px-0 py-4">
                <CardContent>
                    <div className="flex gap-3 items-center">
                        <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                            <IconPackage className="size-8 text-primary" stroke={1.5} />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="text-xl font-medium leading-tight">{global}</p>
                            <p className="text-sm text-muted-foreground">{t("global")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="px-0 py-4">
                <CardContent>
                    <div className="flex gap-3 items-center">
                        <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                            <IconCashBanknote className="size-8 text-primary" stroke={1.5} />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="text-xl font-medium leading-tight">
                                {f.number(total, {
                                    currency: "MZN",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    currencyDisplay: "code",
                                    currencySign: "accounting",
                                    compactDisplay: "long"
                                })}
                            </p>
                            <p className="text-sm text-muted-foreground">{t("total")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="px-0 py-4">
                <CardContent>
                    <div className="flex gap-3 items-center">
                        <div className="size-10 rounded-lg bg-primary/15 flex justify-center items-center">
                            <IconRoute className="size-8 text-primary" stroke={1.5} />
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="text-xl font-medium leading-tight">
                                {f.number(distance, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </p>
                            <p className="text-sm text-muted-foreground">{t("distance")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
