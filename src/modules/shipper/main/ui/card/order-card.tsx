"use client"

import { useFormatter, useTranslations } from "next-intl";
import { IconBiohazard, IconMapPin, IconMapX, IconSnowflake } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardHeader } from "@/components/ui/card";

import { Values } from "@/modules/shipper/main/types/types";
import { StatusBadge, StatusKey } from "@/modules/shipper/main/ui/badge/status-badge";

type Props = {
    values: Values
}
export function OrderCard({ values }: Props) {
    const t = useTranslations("Shipper.main.order.card")
    const f = useFormatter()

    const { order, cargo, trip } = values

    const status = trip ? trip.status : order.status

    return (
        <>
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
        </>
    )
}
