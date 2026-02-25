import { useFormContext } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl"

import { CreateOrderForm as COF } from "@/backend/db/types";

import { Separator } from "@/components/ui/separator";

export function OrderPreviewForm() {
    const t = useTranslations("Shipper.main.order.dialog.preview")
    const f = useFormatter()

    const form = useFormContext<COF>()

    return (
        <div className="px-6">
            <div className="flex flex-col p-6 bg-muted/50 rounded-xl gap-4">
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

                <Separator />

                <div className="flex flex-col gap-2 w-full">
                    <span className="text-muted-foreground text-xs">{t("cargo.label")}</span>
                    <span className="">{t(`cargo.options.${form.watch().cargo.category}`)}</span>
                    <span className="">{form.watch().cargo.description}</span>
                </div>

                <div className="flex justify-between gap-4 items-start">
                    <div className="flex flex-col gap-2 w-full">
                        <span className="text-muted-foreground text-xs">{t("packing.label")}</span>
                        <span className="">{t(`packing.options.${form.watch().cargo.packing}`)}</span>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <span className="text-muted-foreground text-xs">{t("quantity")}</span>
                        <span className="">{form.watch().cargo.quantity} {form.watch().cargo.unit}</span>
                    </div>
                </div>

                <div className="flex justify-between gap-4 items-start">
                    {form.watch().cargo.hazchemCode && (
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("hazarduos")}</span>
                            <span className="">{form.watch().cargo.hazchemCode}</span>
                        </div>
                    )}

                    {form.watch().cargo.isRefrigerated && (
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("temperature")}</span>
                            <span className="">{form.watch().cargo.temperature}º C</span>
                            <span className="">{form.watch().cargo.temperatureInstructions}</span>
                        </div>
                    )}
                </div>

                {form.watch().price && (
                    <>
                        <Separator />

                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-muted-foreground text-xs">{t("price")}</span>
                            <span className="">{f.number(form.watch().price ?? 0, {
                                currency: form.watch().currency,
                                currencyDisplay: "symbol",
                                currencySign: "accounting",
                                compactDisplay: "short"
                            })} {form.watch().currency}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
