"use client"

import { useFormatter, useTranslations } from "next-intl";
import { IconBiohazard, IconCancel, IconEdit, IconEye, IconMapPin, IconMapX, IconSnowflake } from "@tabler/icons-react";

import { CATEGORIES, CURRENCY, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Values } from "@/modules/shipper/main/types/types";
import { useUpdateOrder } from "@/modules/shipper/main/hooks/use-update-order"
import { useOrderDetails } from "@/modules/shipper/main/hooks/use-order-details"
import { StatusBadge, StatusKey } from "@/modules/shipper/main/ui/badge/status-badge";

import { cn } from "@/lib/utils"

type Props = {
    values: Values
}
export function OrderCard({ values }: Props) {
    const t = useTranslations("Shipper.main.order.card")
    const f = useFormatter()

    const { onOpenChange: viewDetails } = useOrderDetails()
    const { onOpenChange: updateOrder } = useUpdateOrder()

    const { order, cargo, trip } = values

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
        price: order.price ?? 0,
        currency: order.currency ?? CURRENCY[0]
    }

    const status = trip ? trip.status : order.status

    return (
        <Card className="border border-card hover:border-primary">
            <CardHeader className="gap-2.5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground leading-tight">{t("header.id", { id: order.legacyId.toString().padStart(4, '0') })}</span>
                        <span className="text-base font-semibold">{t(`header.category.${cargo.category}`)}</span>
                    </div>

                    <StatusBadge label={t(`header.status.${status}`)} status={status as StatusKey} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-3 items-center"><IconMapPin className="size-4 text-emerald-500 " />{order.loadingAddress?.[0]?.state ?? ""}</div>
                    <div className="flex gap-3 items-center"><IconMapX className="size-4 text-red-500 " />{order.offloadingAddress?.[0]?.state ?? ""}</div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5 h-full">
                <Separator />

                <div className="flex flex-col gap-1.5 h-full">
                    <div className="flex justify-between items-center gap-2">
                        <div className="text-muted-foreground">{t("content.weight")}</div>
                        <div className="font-medium">{`${cargo.quantity} ${cargo.unit}`}</div>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <div className="text-muted-foreground">{t("content.loading-date")}</div>
                        <div className="font-medium">
                            {f.dateTime(order.expectedLoadingDate, {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {cargo.isRefrigerated && (
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500/25 text-blue-500 px-2 py-1 gap-1.5 inline-flex items-center rounded-sm border-none"
                                >
                                    <IconSnowflake />
                                    {t("content.refrigerated")}
                                </Badge>
                            </div>
                        )}

                        {cargo.isHazardous && (
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-500/25 text-amber-500 px-2 py-1 gap-1.5 inline-flex items-center rounded-sm border-none"
                                >
                                    <IconBiohazard />
                                    {t("content.hazarduos")}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center gap-2 py-2">
                    <div className="text-muted-foreground">{t("content.price")}</div>
                    <div className="font-medium text-xl text-primary space-x-1">
                        <span>
                            {order.price == null
                                ? "0"
                                : f.number(order.price, {
                                    currency: order.currency ?? "MZN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })
                            }
                        </span>
                        <span>{order.currency ?? "MZN"}</span>
                    </div>
                </div>

                <Separator />
            </CardContent>
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

                {order.status === "drafted" && (
                    <div className="w-full">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer font-normal"
                            onClick={() => updateOrder(defaultValues, "continue", order.id)}
                        >
                            <IconEdit />
                            {t("footer.continue")}
                        </Button>
                    </div>
                )}

                {order.status === "open" && (
                    <div className="w-full">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer font-normal"
                            onClick={() => updateOrder(defaultValues, "update", order.id)}
                        >
                            <IconEdit />
                            {t("footer.update")}
                        </Button>
                    </div>
                )}

                {order.status === "booked" && (
                    <div className="w-full">
                        <Button
                            variant="destructive"
                            className="w-full cursor-pointer font-normal"
                        >
                            <IconCancel />
                            {t("footer.cancel")}
                        </Button>
                    </div>
                )}
            </CardFooter>

        </Card>
    )
}
