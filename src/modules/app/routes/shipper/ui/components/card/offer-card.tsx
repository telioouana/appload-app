"use client"

import { useFormatter, useTranslations } from "next-intl"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconCashBanknote, IconCheck, IconX } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"
import { CURRENCY, FISCAL_REGIME, TRIP_TYPE, TripSchemaFrom } from "@/backend/db/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { useOffersList } from "../../../hooks/use-offers-list"
import { Offer, Order, ORDERS_PATH } from "../../../types/types"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

interface Props {
    offer: Offer
    order: Order
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}

export function OfferCard({ offer, order, path, search, cargoType }: Props) {
    const t = useTranslations("Shipper.offers.card")
    const f = useFormatter()

    const { onClose } = useOffersList()

    const client = useQueryClient()
    const trpc = useTRPC()

    const accept = useMutation(
        trpc.shipperOrder.accept.mutationOptions({
            onSuccess: () => {
                client.invalidateQueries(trpc.public.orders.infiniteQueryOptions({
                    path,
                    limit: DEFAULT_PAGE_LIMIT,
                    search: search?.trim() || undefined,
                    cargoType: cargoType?.trim() || undefined,
                }))
                onClose()
            }
        })
    )

    const reject = useMutation(
        trpc.shipperOrder.reject.mutationOptions({
            onSuccess: () => {
                client.invalidateQueries(trpc.public.orders.infiniteQueryOptions({
                    path,
                    limit: DEFAULT_PAGE_LIMIT,
                    search: search?.trim() || undefined,
                    cargoType: cargoType?.trim() || undefined,
                }))
                onClose()
            }
        })
    )

    async function handleReply(status: "accepted" | "rejected") {
        if (status === "accepted") {
            const shipperTotal = Number(offer.price) * 1.10
            const commission = shipperTotal - Number(offer.price)
            const vat = offer.fiscalRegime === "normal"
                ? commission * (0.16 / 1.16)
                : (offer.fiscalRegime === "simplified-3" || offer.fiscalRegime === "simplified-5")
                    ? Number(offer.price) * (0.16 / 1.16)
                    : 0

            const values: TripSchemaFrom = {
                orderId: offer.orderId,
                carrierId: offer.carrierId,
                carrierName: offer.carrierName,

                driverId: offer.driverId,
                driverName: offer.driverName,
                driverPassport: offer.driverPassport,
                driverPhoneNumber: offer.driverPhoneNumber,
                truckPlate: offer.truckPlate,
                truckAge: offer.truckAge,
                trailerPlate: offer.trailerPlate,
                linkPlate: offer.linkPlate,

                proposedLoadingDate: new Date(offer.proposedLoadingDate),
                proposedOffloadingDate: new Date(offer.proposedOffloadingDate),

                status: "booked",
                tripType: order.tripType as typeof TRIP_TYPE[number],

                fiscalRegime: offer.fiscalRegime as typeof FISCAL_REGIME[number],
                carrierSubtotal: String(offer.fiscalRegime === "normal" ? (Number(offer.price) / 1.16) : Number(offer.price)),
                carrierVAT: String(offer.fiscalRegime === "normal" ? (Number(offer.price) * (0.16 / 1.16)) : 0),
                carrierTotal: String(Number(offer.price)),
                carrierCurrency: offer.currency as typeof CURRENCY[number],
                carrierPaymentStatus: "pending",

                apploadCommissionSubtotal: String(commission / 1.16),
                apploadCommissionVAT: String(vat),
                apploadCommissionTotal: String(commission),

                shipperSubtotal: String(shipperTotal / 1.16),
                shipperVAT: String(shipperTotal * (0.16 / 1.16)),
                shipperTotal: String(shipperTotal),
                shipperCurrency: offer.currency as typeof CURRENCY[number],
                shipperPaymentStatus: "pending",

                ageFactor: offer.truckAge === "recent" ? "1" : "1.2",
                loadFactor: order.tripType === "backload" ? "0.8" : order.tripType === "normal" ? "1" : "",
                defaultCoefficient: order.tripType === "backload" ? "0.03" : order.tripType === "normal" ? "0.12" : "",
                totalFuelCost: order.tripType === "backload" ? String((order.distance ?? 0 / 1000) * 0.5 * 86) : "0",
            }
            accept.mutateAsync({
                offerId: offer.id,
                orderId: order.id,
                values
            })
        } else {
            reject.mutateAsync({
                offerId: offer.id
            })
        }
    }

    return (
        <Card className="p-0 gap-y-4">
            <CardHeader className="pt-4 px-4">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-sm">
                        {t("header.id", { id: offer.legacyId.toString().padStart(4, '0') })}
                    </CardTitle>

                    <div>
                        {offer.status === "pending" && <Badge className="bg-amber-400 text-white hover:bg-amber-400/80" variant="outline">{t("header.status.pending")}</Badge>}
                        {offer.status === "updated" && <Badge>{(t("header.status.updated"))}</Badge>}
                        {offer.status === "accepted" && <Badge className="bg-emerald-400 text-white hover:bg-emerald-400/80" variant="outline">{t("header.status.accepted")}</Badge>}
                        {offer.status === "rejected" && <Badge variant="destructive">{t("header.status.rejected")}</Badge>}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4">
                <div className="w-full flex flex-col gap-y-2 items-start justify-center text-sm font-medium">
                    <div className="flex w-full justify-between">
                        <div className="w-full">
                            <p className="text-xs text-muted-foreground">{t("content.load")}</p>
                            <p className="text-primary">
                                {f.dateTime(new Date(offer.proposedLoadingDate), {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </p>
                        </div>

                        <div className="w-full">
                            <p className="text-xs w-full flex justify-end text-muted-foreground">{t("content.offload")}</p>
                            <p className="text-primary w-full flex justify-end">
                                {f.dateTime(new Date(offer.proposedOffloadingDate), {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        <p className="text-xs text-muted-foreground">{t("content.quote")}</p>
                        <div className="space-x-2 flex text-emerald-400 items-center">
                            <IconCashBanknote className="size-4" stroke={1.5} />
                            <span>
                                {f.number(Number(offer.price) * 1.10, {
                                    style: "currency",
                                    currency: offer.currency,
                                    currencyDisplay: "code",
                                    currencySign: "accounting",
                                    compactDisplay: "long"
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pb-4 px-4">
                <div className="grid grid-cols-2 w-full gap-4">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReply("rejected")}
                        disabled={accept.isPending || reject.isPending}
                    >
                        <IconX />
                        {t("footer.reject")}
                    </Button>
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleReply("accepted")}
                        disabled={accept.isPending || reject.isPending}
                    >
                        <IconCheck />
                        {t("footer.accept")}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
