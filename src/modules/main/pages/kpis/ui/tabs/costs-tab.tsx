"use client"

import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

export function CostsTab({ data }: { data: { [x: string]: unknown } }) {
    const t = useTranslations("Main.kpis.main.tabs.content.costs")
    const f = useFormatter()
    const {
        trips,
        distance,
        weight,
        total,
    } = data

    const CPK = (Number(total) / (Number(distance) / 1000)) / Number(trips)
    const CPU = (Number(total) / Number(weight)) / Number(trips)
    const CPUK = Number(total) / ((Number(distance) / 1000) * Number(weight))

    return (
        <div className="grid grid-cols-3 gap-8 pt-4 pb-2">
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("cost-per-km.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(CPK) ? CPK : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("cost-per-km.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("cost-per-unit.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(CPU) ? CPU : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("cost-per-unit.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("cost-per-unit-km.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(CPUK) ? CPUK : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("cost-per-unit-km.unit")}</div>
                </CardContent>
            </Card>
        </div>
    )
}
