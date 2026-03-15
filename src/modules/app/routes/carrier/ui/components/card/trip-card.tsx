"use client"

import { useFormatter, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { TripValues } from "../../../types/types"
import { StatusBadge, StatusKey } from "@/modules/app/ui/components/badge/status-badge";

interface Props {
    values: TripValues
}
export function TripCard({ values }: Props) {
    const t = useTranslations("Carrier.trip.card")
    const f = useFormatter()

    const { cargo, trip } = values

    return (
        <Card className="border border-card hover:border-primary p-0">
            <CardHeader className="pt-4 px-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex gap-4 items-center leading-tight">
                            <span className="text-muted-foreground">{t("header.id", { id: trip.legacyId.toString().padStart(4, '0') })}</span>
                            <StatusBadge label={t(`header.status.${trip.status}`)} status={trip.status as StatusKey} />
                        </div>

                        <span className="font-semibold">{t(`header.category.${cargo.category}`)}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 justify-end">
                        <div className="flex gap-1 items-center leading-tight text-sm font-semibold justify-end">
                            <span>
                                {f.number(Number(trip.carrierTotal) ?? 0, {
                                    currency: trip.carrierCurrency ?? "MZN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    currencyDisplay: "code",
                                    currencySign: "accounting",
                                    compactDisplay: "long"
                                })}
                            </span>
                            <span>{trip.carrierCurrency ?? "MZN"}</span>
                        </div>

                        <div className="flex gap-1 items-center leading-tight text-xs justify-end">
                            <span className="text-sm text-muted-foreground text-end">{trip.loadedWeight ?? cargo.quantity}</span>
                            <span className="text-sm text-muted-foreground text-end">{trip.weightUnit}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>

            </CardContent>
        </Card>
    )
}