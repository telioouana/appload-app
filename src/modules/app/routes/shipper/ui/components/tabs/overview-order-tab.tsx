"use client"

import { useFormatter, useTranslations } from "next-intl"
import { IconArrowRight, IconBiohazard, IconClock, IconCurrencyDollar, IconMapPin, IconPackage, IconSnowflake } from "@tabler/icons-react"

import { Separator } from "@/components/ui/separator"

import { Values } from "../../../types/types"

export function OverviewOrderTab({ values }: { values: Values }) {
    const t = useTranslations("Shipper.order.dialog.details.tabs.content.overview")
    const f = useFormatter()

    const { cargo, order, trip } = values

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-scroll container-snap">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-blue-500 bg-blue-100 p-4 rounded-xl flex flex-col gap-1.5">
                    <IconPackage className="size-5 text-blue-500" />
                    <span className="text-xs text-muted-foreground">{t("card.quantity")}</span>
                    <span className="text-xl font-semibold text-black">{cargo.quantity} {cargo.unit}</span>
                </div>
                <div className="border border-emerald-500 bg-emerald-100 p-4 rounded-xl flex flex-col gap-1.5">
                    <IconCurrencyDollar className="size-5 text-emerald-500" />
                    <span className="text-xs text-muted-foreground">{t("card.total-amount")}</span>
                    <div className="flex gap-1 text-xl font-semibold text-black">
                        <span>
                            {order.price == null
                                ? "0"
                                : f.number(order.price, {
                                    compactDisplay: "long",
                                    currencyDisplay: "code",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    currencySign: "accounting",
                                    currency: order.currency ?? "MZN",
                                })
                            }
                        </span>
                        <span>{order.currency ?? "MZN"}</span>
                    </div>
                </div>
                <div className="border border-amber-500 bg-amber-100 p-4 rounded-xl flex flex-col gap-1.5">
                    <IconClock className="size-5 text-amber-500" />
                    <span className="text-xs text-muted-foreground">{t("card.delivery-date")}</span>
                    {trip && trip.actualOffloadingDate && (
                        <span className="text-xl font-semibold text-black">
                            {f.dateTime(trip.actualOffloadingDate, {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </span>
                    )}

                </div>
            </div>

            <div className="bg-muted/70 p-4 rounded-xl flex flex-col gap-4">
                <h4 className="font-medium">{t("info.order.title")}</h4>

                <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs text-muted-foreground">{t("info.order.loading")}</span>
                        <span className="font-medium">
                            {f.dateTime(order.expectedLoadingDate, {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs text-muted-foreground">{t("info.order.offloading")}</span>
                        <span className="font-medium">
                            {f.dateTime(order.expectedOffloadingDate, {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <IconMapPin className="text-primary" stroke={1.5} />
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs text-muted-foreground">{t("info.order.route")}</span>
                        <div className="flex gap-2 items-center">
                            <span className="font-medium">{order.loadingAddress?.[0].state}</span>

                            <IconArrowRight className="w-7 h-3" />

                            <span className="font-medium">{order.offloadingAddress?.[0].state}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs text-muted-foreground">{t("info.cargo.category.label")}</span>
                        <span className="font-medium">{t(`info.cargo.category.${cargo.category}`)}</span>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <span className="text-xs text-muted-foreground">{t("info.cargo.description")}</span>
                        <span className="font-medium">{cargo.description}</span>
                    </div>
                </div>

                {cargo.isRefrigerated && (
                    <div className="flex items-start gap-2">
                        <IconSnowflake className="text-blue-500 size-5" stroke={1} />
                        <div className="flex flex-col gap-1 w-full">
                            <div className="bg-blue-200 w-fit text-blue-500 px-3 py-0.5 gap-1.5 inline-flex items-center rounded-sm border-none">
                                {t("info.cargo.refrigerated")}
                            </div>

                            <div className="flex items-center gap-2 font-medium">
                                <span>{cargo.temperature}º C</span>
                                <span>{cargo.temperatureInstructions}</span>
                            </div>
                        </div>
                    </div>
                )}

                {cargo.isHazardous && (
                    <div className="flex items-start gap-2">
                        <IconBiohazard className="text-amber-500 size-5" stroke={1} />
                        <div className="flex flex-col gap-1 w-full">
                            <div className="bg-amber-200 w-fit text-amber-500 px-3 py-0.5 gap-1.5 inline-flex items-center rounded-sm border-none">
                                {t("info.cargo.hazarduos")}
                            </div>

                            <span className="font-medium">{cargo.description}</span>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}
