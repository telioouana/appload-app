"use client"

import { useFormatter, useTranslations } from "next-intl";
import { IconBiohazard, IconContract, IconEye, IconInvoice, IconMapDown, IconMapPin, IconMapUp, IconMapX, IconSnowflake } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { cn } from "@/lib/utils"

import { OrderValues } from "../../../types/types";
import { useAcceptOrder } from "../../../hooks/use-accept-order";
import { useCreateOffer } from "../../../hooks/use-create-offer";
import { useOrderDetails } from "../../../hooks/use-order-details";
import { StatusBadge, StatusKey } from "@/modules/app/ui/components/badge/status-badge";

type Props = {
    values: OrderValues
}
export function OrderCard({ values }: Props) {
    const { onOpenChange: acceptOrder } = useAcceptOrder()
    const { onOpenChange: viewOrder } = useOrderDetails()
    const { onOpenChange: makeOffer } = useCreateOffer()

    const t = useTranslations("Carrier.order.card")
    const f = useFormatter()

    const { order, cargo, offer } = values

    return (
        <Card className={cn("border border-card hover:border-primary", order.share === "subscribers" && "bg-orange-50 dark:bg-orange-50/20")}>
            <CardHeader className="gap-2.5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground leading-tight">{t("header.id", { id: order.legacyId.toString().padStart(4, '0') })}</span>
                        <span className="text-base font-semibold">{t(`header.category.${cargo.category}`)}</span>
                    </div>

                    <div className="flex flex-col gap-0.5 justify-end items-end">
                        <StatusBadge label={t(`header.status.${order.status}`)} status={order.status as StatusKey} />
                        {order.share === "subscribers" && (
                            <div className="flex items-center gap-2">
                                <Badge variant="ghost" className="font-medium text-primary">
                                    {order.shipperName}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-3 items-center"><IconMapPin className="size-4 text-emerald-500 " />{order.loadingAddress?.[0]?.state ?? ""}</div>
                    <div className="flex gap-3 items-center"><IconMapX className="size-4 text-red-500 " />{order.offloadingAddress?.[0]?.state ?? ""}</div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5 h-full">
                <Separator className={cn(order.share === "subscribers" && "bg-orange-300")} />

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

                <Separator className={cn(order.share === "subscribers" && "bg-orange-300")} />

                {(order.share === "subscribers")
                    ? (
                        <div className="flex justify-between items-center gap-2 py-2">
                            <div className="text-muted-foreground">{t("content.price")}</div>
                            <div className="font-medium text-xl text-primary space-x-1">
                                <span>
                                    {f.number(order.price ?? 0, {
                                        currency: order.currency ?? "MZN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                                <span>{order.currency ?? "MZN"}</span>
                            </div>
                        </div>
                    ) : (
                        <Badge
                            variant="default"
                            className={cn(
                                "w-full py-4 gap-1.5 inline-flex items-center rounded-sm border-none justify-center text-center font-semibold",
                                order.tripType === "backload" ? "bg-orange-300/20 text-orange-600" : "bg-teal-300/20 text-teal-600"
                            )}
                        >
                            {order.tripType === "normal" ? <IconMapUp /> : <IconMapDown />}
                            {t(`content.type.${order.tripType}`)}
                        </Badge>
                    )
                }

                <Separator className={cn(order.share === "subscribers" && "bg-orange-300")} />
            </CardContent>
            <CardFooter className="flex justify-between gap-2 items-center">
                <div className="w-full">
                    <Button
                        onClick={() => viewOrder(values)}
                        className={cn("w-full bg-orange-200 text-primary hover:bg-orange-300 cursor-pointer font-normal")}
                    >
                        <IconEye />
                        {t("footer.view")}
                    </Button>
                </div>

                {order.share === "subscribers"
                    ? (
                        <div className="w-full">
                            <Button
                                variant="success"
                                className="w-full cursor-pointer font-normal"
                                onClick={() => acceptOrder(values)}
                            >
                                <IconContract />
                                {t("footer.accept")}
                            </Button>
                        </div>
                    ) : (
                        <>
                            {(!offer) && (
                                <div className="w-full">
                                    <Button
                                        variant="default"
                                        className="w-full cursor-pointer font-normal"
                                        onClick={() => makeOffer(values)}
                                    >
                                        <IconInvoice />
                                        {t("footer.place-bid")}
                                    </Button>
                                </div>
                            )}

                            {offer?.status === "rejected" && (
                                <div className="w-full">
                                    <Button
                                        variant="default"
                                        className="w-full cursor-pointer font-normal"
                                        onClick={() => makeOffer(values)}
                                    >
                                        <IconInvoice />
                                        {t("footer.update-bid")}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
            </CardFooter>
        </Card >
    )
}
