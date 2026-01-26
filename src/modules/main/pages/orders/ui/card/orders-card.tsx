"use client"

import { z } from "zod";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconChecks, IconFlag, IconInvoice, IconContract, IconSearch } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";
import { cargo, order, trip } from "@/backend/db/schema";
import { FISCAL_REGIME, TripSchema, WEIGHT_UNIT } from "@/backend/db/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { FilterByType, FilterType, UserType } from "@/modules/main/ui/types";
import { StatusBadge, StatusKey } from "@/modules/main/ui/badge/status-badge";
import { UpdateOrderDialog } from "@/modules/main/pages/order/ui/dialog/update-order-dialog";

type Props = {
    cargo: typeof cargo.$inferSelect
    order: typeof order.$inferSelect
    trip: typeof trip.$inferSelect | null
    organizationId: string
    organizationName: string
    fiscalRegime: string | null
    userType: UserType
    filter?: FilterType
    filterBy?: FilterByType
}

export function OrdersCard({ cargo, order, trip, organizationId, organizationName, fiscalRegime, userType, filter, filterBy }: Props) {
    const t = useTranslations("Main.orders.card")
    const f = useFormatter()

    const status = trip ? trip.status : order.status
    console.log("Filter Type:", filter, "Filter By Type:", filterBy);

    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const accept = useMutation(
        trpc.order.accept.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.orders.all.queryOptions({
                    limit: 8,
                    filter,
                    filterBy,
                }))
            }
        })
    )

    async function handleAccept() {
        const values: z.input<typeof TripSchema> = {
            orderId: order.id,
            carrierId: organizationId,
            carrierName: organizationName,

            driverId: null,
            driverName: null,
            driverPassport: null,
            driverPhoneNumber: null,
            truckPlate: null,
            truckAge: null,
            trailerPlate: null,
            linkPlate: null,

            proposedLoadingDate: order.expectedLoadingDate,
            arrivalAtLoading: null,
            arrivalOnTimeLoading: false,
            actualLoadingDate: null,
            departureLoadingDate: null,
            daysSpendLoading: null,

            daysSpendTraveling: null,

            proposedOffloadingDate: order.expectedOffloadingDate,
            arrivalAtOffloading: null,
            arrivalOnTimeOffloading: false,
            actualOffloadingDate: null,
            departureOffloadingDate: null,
            daysSpendOffloading: null,

            demurageCharged: false,
            totalDemurageChargedDays: null,
            arrivalAtBorder: null,
            departureFromBorder: null,

            loadedWeight: cargo.quantity,
            offloadedWeight: null,
            weightUnit: cargo.unit as typeof WEIGHT_UNIT[number],

            tripType: null,
            deliveries: 1,
            podStatus: null,
            status: "booked",

            carrierInvoiceNumber: null,
            carrierInvoiceDate: null,
            fiscalRegime: fiscalRegime as typeof FISCAL_REGIME[number],
            carrierSubtotal: "0",
            carrierVAT: "0",
            carrierTotal: "0",
            carrierCurrency: null,
            carrierPaidPartially: null,
            carrierPaidAmount: null,
            carrierPaidPercentage: null,
            carrierPaymentStatus: "not-applicable",
            carrierRemainingAmount: null,
            carrierRemainingPercentage: null,
            carrierFullPaymentDate: null,

            insuranceSubscriber: null,
            insuranceValue: "0",
            insuranceCurrency: null,
            insuranceStatus: null,

            apploadCommissionSubtotal: "0",
            apploadCommissionVAT: "0",
            apploadCommissionTotal: "0",

            shipperInvoiceNumber: null,
            shipperInvoiceDate: null,
            shipperSubtotal: "0",
            shipperVAT: "0",
            shipperTotal: "0",
            shipperCurrency: null,
            shipperPaidPartially: null,
            shipperPaidAmount: null,
            shipperPaidPercentage: null,
            shipperPaymentStatus: "not-applicable",
            shipperRemainingAmount: null,
            shipperRemainingPercentage: null,
            shipperFullPaymentDate: null,
        }

        console.log("Accepting order with values:", values);
        await accept.mutateAsync({
            values
        })
    }
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <CardTitle>{t("header.id", { id: order.legacyId.toString().padStart(5, '0') })}</CardTitle>
                    {order.share == "subscribers" && userType == "carrier" && (<CardDescription className="font-semibold text-primary">{order.shipperName}</CardDescription>)}
                </div>

                <div className="flex gap-2">
                    <StatusBadge label={t(`header.status.${status}`)} status={status as StatusKey} />
                    {order.share == "subscribers" && userType == "carrier" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="destructive"><IconFlag /></Badge>
                            </TooltipTrigger>
                            <TooltipContent>{t("header.subscribers")}</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{t("content.category.label")}</span>
                        <span className="text-sm font-semibold">{t(`content.category.options.${cargo.category}`)}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs text-muted-foreground">{t("content.quantity.label")}</span>
                        <span className="text-sm font-semibold">{t(`content.quantity.units.${cargo.unit}`, { quantity: cargo.quantity })}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">{t("content.shipping.label")}</span>
                    <div className="grid grid-cols-2 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">{t("content.shipping.from")}</span>
                            <span className="text-sm font-semibold">
                                {f.dateTime(order.expectedLoadingDate, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-xs text-muted-foreground">{t("content.shipping.to")}</span>
                            <span className="text-sm font-semibold">
                                {f.dateTime(order.expectedOffloadingDate, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{t("content.distance")}</span>
                    <span className="text-sm font-semibold">
                        {f.number((order.distance ? order.distance / 1000 : 0), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })} Km
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">{t("content.location.label")}</span>
                    <div className="grid grid-cols-2 items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">{t("content.location.from")}</span>
                            <span className="text-sm font-semibold">
                                {order.loadingAddress?.[0].state}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-xs text-muted-foreground">{t("content.location.to")}</span>
                            <span className="text-sm font-semibold">
                                {order.offloadingAddress?.[0].state}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <div className="flex items-center justify-between gap-4 w-full">
                    <div className="w-full">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={accept.isPending}
                        >
                            {t("footer.buttons.details")}
                            <IconContract />
                        </Button>
                    </div>

                    {userType == "carrier" &&
                        (order.share == "subscribers" && order.status == "pending" && !trip
                            ? (
                                <div className="w-full">
                                    <Button
                                        type="button"
                                        variant="success"
                                        className="w-full"
                                        onClick={handleAccept}
                                        disabled={accept.isPending}
                                    >
                                        {t("footer.buttons.accept")}
                                        {accept.isPending ? <Spinner /> : <IconChecks />}
                                    </Button>
                                </div>
                            )
                            :
                            (order.status == "pending" && !trip
                                ? (
                                    <div className="w-full">
                                        <Button
                                            type="button"
                                            className="w-full"
                                            disabled={accept.isPending}
                                        >
                                            {t("footer.buttons.offer")}
                                            <IconInvoice />
                                        </Button>
                                    </div>
                                )
                                :
                                (order.status == "prospect" && !trip
                                    ? (
                                        <div className="w-full">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                disabled={accept.isPending}
                                            >
                                                {t("footer.buttons.quote")}
                                                <IconSearch />
                                            </Button>
                                        </div>
                                    )
                                    : (
                                        null
                                    )
                                )
                            )
                        )
                    }
                    {userType == "shipper" &&
                        (order.status == "drafted"
                            ? (
                                <div className="w-full">
                                    <UpdateOrderDialog
                                        action="continue"
                                        cargo={cargo}
                                        order={order}
                                        className="w-full"
                                    />
                                </div>
                            )
                            : (order.status == "prospect" || order.status == "pending"
                                ? (
                                    <div className="w-full">
                                        <UpdateOrderDialog
                                            action="update"
                                            cargo={cargo}
                                            order={order}
                                            className="w-full"
                                        />
                                    </div>
                                )
                                : (
                                    null
                                )
                            )
                        )
                    }
                </div>
            </CardFooter>
        </Card>
    )
}
