"use client"

import { useFormatter, useTranslations } from "next-intl";

import { CURRENCY } from "@/backend/db/types";

import { Card, CardContent } from "@/components/ui/card";

import { UserType } from "@/modules/main/ui/types";


export function EfficiencyTab({ currency, data, userType }: { currency: typeof CURRENCY[number], data: { [x: string]: unknown }, userType: UserType }) {
    const t = useTranslations("Main.kpis.main.tabs.content.efficiency")
    const f = useFormatter()
    const {
        trips,
        backload,
        backloadDistance,
        ageFactor,
        loadFactor,
        defaultCoefficient,
        loadedWeight,
        amountFuel,
        invoiceTotal,
        total,
    } = data

    const BT = Number(backload) / Number(trips) * 100
    const EM = Number(defaultCoefficient) * Number(loadFactor) * Number(ageFactor) * (Number(backloadDistance) / 1000) * Number(loadedWeight)
    const MOF = Number(amountFuel) !== 0
        ? ((Number(invoiceTotal) - Number(amountFuel)) / Number(amountFuel)) * 100
        : 0
    const BACKLOAD_RATIO = 0.7 // ratio of backload cost to normal cost
    const SWB = (Number(total) / BACKLOAD_RATIO) - Number(total)

    return (
        <div className="grid grid-cols-3 gap-8 pt-4 pb-2">
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("backload.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number.isFinite(BT) ? BT : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("backload.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("emissions.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(EM) ? EM : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("emissions.unit")}</div>
                </CardContent>
            </Card>

            {userType === "carrier"
                ? (
                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm h-8">{t("margin-over-fuel.label")}</div>
                            <div className="font-medium text-primary">
                                {f.number(!Number.isNaN(MOF) ? MOF : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t("margin-over-fuel.unit")}</div>
                        </CardContent>
                    </Card>
                )
                : (
                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm h-8">{t("saved-with-backload.label")}</div>
                            <div className="font-medium text-primary">
                                {f.number(!Number.isNaN(SWB) ? SWB : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`saved-with-backload.unit.${currency}`)}</div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}
