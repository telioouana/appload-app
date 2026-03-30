"use client"

import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconBiohazard, IconCancel, IconEdit, IconEye, IconMapDown, IconMapPin, IconMapUp, IconMapX, IconSnowflake } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";
import { CATEGORIES, CURRENCY, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { ORDERS_PATH, Values } from "../../../types/types";
import { useOffersList } from "../../../hooks/use-offers-list";
import { useUpdateOrder } from "../../../hooks/use-update-order";
import { useOrderDetails } from "../../../hooks/use-order-details";
import { StatusBadge, StatusKey } from "@/modules/app/ui/components/badge/status-badge";

import { cn } from "@/lib/utils"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

type Props = {
    values: Values
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}
export function OrderCard({ values, path, search, cargoType }: Props) {
    const t = useTranslations("Shipper.order.card")
    const f = useFormatter()

    const { onOpenChange: viewDetails } = useOrderDetails()
    const { onOpenChange: updateOrder } = useUpdateOrder()
    const { onOpenChange: viewOffers } = useOffersList()

    const client = useQueryClient()
    const trpc = useTRPC()

    const { order, cargo, trip, status: liveStatus, offers } = values // Extract liveStatus

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

    const cancel = useMutation(
        trpc.shipperOrder.cancel.mutationOptions({
            onSuccess: () => {
                if (order.share === "subscribers") {
                    client.invalidateQueries(trpc.private.orders.infiniteQueryOptions({
                        path,
                        limit: DEFAULT_PAGE_LIMIT,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                    client.invalidateQueries(trpc.private.resume.queryOptions({
                        path,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                } else {
                    client.invalidateQueries(trpc.public.orders.infiniteQueryOptions({
                        path,
                        limit: DEFAULT_PAGE_LIMIT,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                    client.invalidateQueries(trpc.public.resume.queryOptions({
                        path,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                }
            }
        })
    )

    async function handleCancel() {
        cancel.mutateAsync({
            orderId: order.id,
            tripId: trip?.id
        })
    }

    /**
     * PRIORITY LOGIC:
     * 1. If we have a live timeline status (from lateral join), use it.
     * 2. Else if we have a trip but no timeline, use trip status.
     * 3. Fallback to order status.
     */
    const displayStatus = liveStatus?.status ?? trip?.status ?? order.status

    return (
        <Card className="border border-card hover:border-primary">
            <CardHeader className="gap-2.5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground leading-tight">
                            {t("header.id", { id: order.legacyId.toString().padStart(4, '0') })}
                        </span>
                        <span className="text-base font-semibold">
                            {t(`header.category.${cargo.category}`)}
                        </span>
                    </div>

                    {/* Use the new displayStatus here */}
                    <StatusBadge
                        label={t(`header.status.${displayStatus}`)}
                        status={displayStatus as StatusKey}
                    />
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

                <Separator />
            </CardContent>
            <CardFooter className="flex justify-between gap-2 items-center">
                <div className="w-full">
                    <Button
                        disabled={cancel.isPending}
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
                        {offers.length > 0
                            ? (
                                <Button
                                    variant="success"
                                    className="w-full cursor-pointer font-normal"
                                    onClick={() => viewOffers(offers, order)}
                                >
                                    <IconEdit />
                                    {t("footer.offers", { offers: offers.length })}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer font-normal"
                                    onClick={() => updateOrder(defaultValues, "update", order.id)}
                                >
                                    <IconEdit />
                                    {t("footer.update")}
                                </Button>
                            )
                        }
                    </div>
                )}

                {order.status === "booked" && (
                    <div className="w-full">
                        <Button
                            variant="destructive"
                            onAbort={handleCancel}
                            disabled={cancel.isPending}
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
