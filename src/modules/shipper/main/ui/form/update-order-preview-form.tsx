import { useFormContext } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl"

import { CreateOrderForm as COF } from "@/backend/db/types";

import { Separator } from "@/components/ui/separator";
import { IconArrowRight } from "@tabler/icons-react";

export function UpdateOrderPreviewForm({ values }: { values: COF }) {
    const t = useTranslations("Shipper.main.order.dialog.preview")
    const f = useFormatter()

    const form = useFormContext<COF>()

    return (
        <div className="px-6">
            <div className="flex flex-col p-6 bg-muted/50 rounded-xl gap-4">
                {(
                    values.loadingAddress[0].address !== form.watch().loadingAddress[0].address ||
                    values.offloadingAddress[0].address !== form.watch().offloadingAddress[0].address
                )
                    ? (
                        <div className="flex justify-between gap-4 items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("route.from")}</span>
                                {values.loadingAddress[0].address !== form.watch().loadingAddress[0].address
                                    ? (
                                        <>
                                            <span className="text-red-400 line-through">{values.loadingAddress[0].address}</span>
                                            <span className="text-emerald-400">{form.watch().loadingAddress[0].address}</span>
                                        </>
                                    ) : (
                                        <span className="">{form.watch().loadingAddress[0].address}</span>
                                    )
                                }
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("route.to")}</span>
                                {values.offloadingAddress[0].address !== form.watch().offloadingAddress[0].address
                                    ? (
                                        <>
                                            <span className="text-red-400 line-through">{values.offloadingAddress[0].address}</span>
                                            <span className="text-emerald-400">{form.watch().offloadingAddress[0].address}</span>
                                        </>
                                    ) : (
                                        <span className="">{form.watch().offloadingAddress[0].address}</span>
                                    )
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between gap-4 items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("route.from")}</span>
                                <span className="">{form.watch().loadingAddress[0].address}</span>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("route.to")}</span>
                                <span className="">{form.watch().offloadingAddress[0].address}</span>
                            </div>
                        </div>
                    )
                }

                {(
                    f.dateTime(values.expectedLoadingDate) !== f.dateTime(form.watch().expectedLoadingDate) ||
                    f.dateTime(values.expectedOffloadingDate) !== f.dateTime(form.watch().expectedOffloadingDate)
                )
                    ? (
                        <>
                            <div className="flex justify-between gap-4 items-start">

                                <div className="flex flex-col gap-2 w-full">
                                    <span className="text-muted-foreground text-xs">{t("loading-date")}</span>
                                    {f.dateTime(values.expectedLoadingDate) !== f.dateTime(form.watch().expectedLoadingDate)
                                        ? (
                                            <div className="flex gap-2 items-center">
                                                <span className="text-red-400 line-through">{f.dateTime(values.expectedLoadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}</span>

                                                <IconArrowRight className="w-7 h-3" />

                                                <span className="text-emerald-400">{f.dateTime(form.watch().expectedLoadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}</span>
                                            </div>
                                        ) : (
                                            <span className="">{
                                                f.dateTime(form.watch().expectedLoadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })
                                            }</span>
                                        )
                                    }
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <span className="text-muted-foreground text-xs">{t("offloading-date")}</span>
                                    {f.dateTime(values.expectedOffloadingDate) !== f.dateTime(form.watch().expectedOffloadingDate)
                                        ? (
                                            <div className="flex gap-2 items-center">
                                                <span className="text-red-400 line-through">{f.dateTime(values.expectedOffloadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}</span>
                                                <IconArrowRight className="w-7 h-3" />
                                                <span className="text-emerald-400">{f.dateTime(form.watch().expectedOffloadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}</span>
                                            </div>
                                        ) : (
                                            <span className="">{
                                                f.dateTime(form.watch().expectedOffloadingDate, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })
                                            }</span>
                                        )
                                    }
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="flex justify-between gap-4 items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("loading-date")}</span>
                                <span className="">{
                                    f.dateTime(form.watch().expectedLoadingDate, {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                }</span>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("offloading-date")}</span>
                                <span className="">{
                                    f.dateTime(form.watch().expectedOffloadingDate, {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                }</span>
                            </div>
                        </div>
                    )
                }

                <Separator />

                {(
                    values.cargo.category !== form.watch().cargo.category &&
                    values.cargo.description !== form.watch().cargo.description
                )
                    ? (
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("cargo.label")}</span>
                            {values.cargo.category !== form.watch().cargo.category
                                ? (
                                    <div className="flex gap-2 items-center">
                                        <span className="font-medium text-red-400 line-through">{t(`cargo.options.${values.cargo.category}`)}</span>
                                        <IconArrowRight className="w-7 h-3" />
                                        <span className="font-medium text-emerald-400">{t(`cargo.options.${form.watch().cargo.category}`)}</span>
                                    </div>
                                ) : (
                                    <span className="">{t(`cargo.options.${form.watch().cargo.category}`)}</span>
                                )
                            }

                            {values.cargo.description !== form.watch().cargo.description
                                ? (
                                    <div className="flex gap-2 items-center">
                                        <span className="font-medium text-red-400 line-through">{values.cargo.description}</span>
                                        <IconArrowRight className="w-7 h-3" />
                                        <span className="font-medium text-emerald-400">{form.watch().cargo.description}</span>
                                    </div>
                                ) : (
                                    <span className="">{form.watch().cargo.description}</span>
                                )
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 w-fit">
                            <span className="text-muted-foreground text-xs">{t("cargo.label")}</span>
                            <span className="">{t(`cargo.options.${form.watch().cargo.category}`)}</span>
                            <span className="">{form.watch().cargo.description}</span>
                        </div>
                    )
                }

                {(
                    values.cargo.packing !== form.watch().cargo.packing ||
                    values.cargo.quantity !== form.watch().cargo.quantity
                )
                    ? (
                        <div className="flex justify-between gap-4 items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("packing.label")}</span>
                                {values.cargo.packing !== form.watch().cargo.packing
                                    ? (
                                        <div className="flex gap-2 items-center">
                                            <span className="text-red-400 line-through">{t(`packing.options.${values.cargo.packing}`)}</span>
                                            <IconArrowRight className="w-7 h-3" />
                                            <span className="text-emerald-400">{t(`packing.options.${form.watch().cargo.packing}`)}</span>
                                        </div>
                                    ) : (
                                        <span className="">{t(`packing.options.${form.watch().cargo.packing}`)}</span>
                                    )
                                }
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("quantity")}</span>
                                {values.cargo.quantity !== form.watch().cargo.quantity
                                    ? (
                                        <div className="flex gap-2 items-center">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-red-400 line-through">{values.cargo.quantity}</span>
                                                <IconArrowRight className="w-7 h-3" />
                                                <span className="text-emerald-400">{form.watch().cargo.quantity}</span>
                                            </div>
                                            <span className="">{form.watch().cargo.unit}</span>
                                        </div>
                                    ) : (
                                        <span className="">{form.watch().cargo.quantity} {form.watch().cargo.unit}</span>
                                    )
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between gap-4 items-start">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("packing.label")}</span>
                                <span className="">{t(`packing.options.${form.watch().cargo.packing}`)}</span>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-muted-foreground text-xs">{t("quantity")}</span>
                                <span className="">{form.watch().cargo.quantity} {form.watch().cargo.unit}</span>
                            </div>
                        </div >
                    )
                }


                <div className="flex justify-between gap-4 items-start">
                    {(values.cargo.isHazardous || form.watch().cargo.isHazardous) && (
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("hazarduos")}</span>
                            {values.cargo.hazchemCode !== form.watch().cargo.hazchemCode
                                ? (
                                    <div className="flex gap-2 items-center">
                                        {values.cargo.hazchemCode && <span className="text-red-400 line-through">{values.cargo.hazchemCode}</span>}
                                        {values.cargo.hazchemCode && form.watch().cargo.hazchemCode && <IconArrowRight className="w-7 h-3" />}
                                        {form.watch().cargo.hazchemCode && <span className="text-emerald-400">{form.watch().cargo.hazchemCode}</span>}
                                    </div>
                                ) : (
                                    <span className="">{form.watch().cargo.hazchemCode}</span>
                                )
                            }
                        </div>
                    )}

                    {(values.cargo.isRefrigerated || form.watch().cargo.isRefrigerated) && (
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("temperature")}</span>
                            {values.cargo.temperature !== form.watch().cargo.temperature
                                ? (
                                    <div className="flex gap-2 items-center">
                                        <span className="text-red-400 line-through">{values.cargo.temperature}º C</span>
                                        <IconArrowRight className="w-7 h-3" />
                                        <span className="text-emerald-400">{form.watch().cargo.temperature}º C</span>
                                    </div>
                                ) : (
                                    <span className="">{form.watch().cargo.temperature}º C</span>
                                )
                            }
                            {values.cargo.temperatureInstructions !== form.watch().cargo.temperatureInstructions
                                ? (
                                    <div className="flex flex-col gap-2 items-center">
                                        {values.cargo.temperatureInstructions && <span className="text-red-400 line-through">{values.cargo.temperatureInstructions}</span>}
                                        {form.watch().cargo.temperatureInstructions && <span className="text-emerald-400">{form.watch().cargo.temperatureInstructions}</span>}
                                    </div>
                                ) : (
                                    <span className="">{form.watch().cargo.temperatureInstructions}</span>
                                )
                            }
                        </div>
                    )}
                </div>

                {(
                    values.share !== form.watch().share ||
                    values.price !== form.watch().price
                )
                    && (
                        <>
                            <Separator />

                            {values.share !== form.watch().share && (
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400 line-through">{values.share}</span>
                                    <IconArrowRight className="w-7 h-3" />
                                    <span className="text-emerald-400">{form.watch().share}</span>
                                </div>
                            )}

                            {values.price !== form.watch().price
                                ? (
                                    <div className="flex items-center gap-2">
                                        {!!values.price
                                            && (
                                                <span className="text-red-400 line-through">{f.number(values.price ?? 0, {
                                                    currency: form.watch().currency,
                                                    currencyDisplay: "symbol",
                                                    currencySign: "accounting",
                                                    compactDisplay: "short"
                                                })} {form.watch().currency}</span>
                                            )
                                        }

                                        {!!values.price && form.watch().price && <IconArrowRight className="w-7 h-3" />}

                                        {form.watch().price
                                            && (
                                                <span className="text-emerald-400">{f.number(form.watch().price ?? 0, {
                                                    currency: form.watch().currency,
                                                    currencyDisplay: "symbol",
                                                    currencySign: "accounting",
                                                    compactDisplay: "short"
                                                })} {form.watch().currency}</span>
                                            )
                                        }
                                    </div>
                                ) : values.share !== "non-subscribers"
                                && (
                                    <div className="flex flex-col gap-2 w-full">
                                        <span className="text-muted-foreground text-xs">{t("price")}</span>
                                        <span className="">{f.number(form.watch().price ?? 0, {
                                            currency: form.watch().currency,
                                            currencyDisplay: "symbol",
                                            currencySign: "accounting",
                                            compactDisplay: "short"
                                        })} {form.watch().currency}</span>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div >
        </div >
    )
}
