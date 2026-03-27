"use client"

import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { TripValues } from "../../../types/types"
import { StatusBadge, StatusKey } from "@/modules/app/ui/components/badge/status-badge";
import { IconArrowRight, IconClock, IconLineDashed, IconMapPin, IconRoute, IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface Props {
    values: TripValues
}
export function TripCard({ values }: Props) {
    const t = useTranslations("Carrier.trip.card")
    const f = useFormatter()

    const { cargo, order, trip } = values

    return (
        <Card className="border border-card hover:border-primary p-0">
            <CardContent className="p-4 flex gap-4">
                <div className="flex flex-col flex-1 gap-4 w-full">
                    <CardHeader className="p-0">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1.5 text-sm">
                                <div className="flex gap-4 items-center leading-tight">
                                    <span className="text-muted-foreground">{t("header.id", { id: trip.legacyId.toString().padStart(4, '0') })}</span>
                                    <StatusBadge label={t(`header.status.${trip.status}`)} status={trip.status as StatusKey} />
                                </div>

                                <div className="flex gap-2 items-center leading-tight">
                                    <span className="font-semibold">{t(`header.category.${cargo.category}`)}</span>
                                    <IconLineDashed className="size-4" stroke={1.5} />
                                    <span className="font-semibold">{cargo.description}</span>
                                </div>
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
                                    <span className="text-sm text-muted-foreground text-end">{trip.loadedWeight ??
                                        cargo.quantity}</span>
                                    <span className="text-sm text-muted-foreground text-end">{trip.weightUnit}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <div className="grid grid-cols-5 items-start gap-8">
                        <div className="flex items-start gap-2 w-full">
                            <IconRoute className="text-primary size-5" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("content.route")}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="font-medium">{order.loadingAddress?.[0]?.state}</span>

                                    <IconArrowRight className="w-4 h-3" />

                                    <span className="font-medium">{order.offloadingAddress?.[0]?.state}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 w-full">
                            <IconClock className="text-primary size-5" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("content.distance")}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="font-medium">
                                        {f.number(order.distance ? order.distance / 1000 : 0, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })} Km
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 w-full">
                            <IconUser className="text-primary size-5" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("content.driver")}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="font-medium">{trip.driverName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 w-full">
                            <IconUser className="text-primary size-5" stroke={1.5} />
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs text-muted-foreground">{t("content.truck")}</span>
                                <div className="flex gap-2 items-center">
                                    <span className="font-medium">{trip.truckPlate}</span>
                                </div>
                            </div>
                        </div>

                        {values.tracking?.location?.[0] && (
                            <div className="flex items-start gap-2 w-full">
                                <IconMapPin className="text-primary size-5" stroke={1.5} />
                                <div className="flex flex-col gap-1 w-full">
                                    <span className="text-xs text-muted-foreground">{t("content.location")}</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-medium">{values.tracking.location[0].state}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
    
                <div className="space-y-4 hidden">
                    <Button
                        className="bg-orange-300/80 text-primary font-normal"
                    >
                        Manage
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}