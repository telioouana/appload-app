"use client"

import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

export function OperationalTab({ data }: { data: { [x: string]: unknown } }) {
    const t = useTranslations("Main.kpis.main.tabs.content.operational")
    const f = useFormatter()
    const {
        trips,
        onTimeAtLoading,
        averageLoadingTime,
        averageTravelTime,
        distance,
        onTimeAtOffloading,
        averageOffloadingTime,
        demuragesOccurrences,
        damuragesChargedDays,
    } = data

    const DC = Number(demuragesOccurrences) / Number(trips)
    const OTL = Number(onTimeAtLoading) / Number(trips) * 100
    const OTO = Number(onTimeAtOffloading) / Number(trips) * 100
    const ADCD = Number(distance) / Number(trips) / Number(averageTravelTime) / 1000
    
    return (
        <div className="grid grid-cols-3 gap-8 pt-4 pb-2">
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("on-time-loading.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(OTL) ? OTL : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("on-time-loading.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("average-loading-time.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(Number(averageLoadingTime)) ? Number(averageLoadingTime) : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("average-loading-time.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("average-travel-time.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(Number(averageTravelTime)) ? Number(averageTravelTime) : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("average-travel-time.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("average-daily-distance.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(ADCD) ? ADCD : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("average-daily-distance.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("on-time-offloading.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(OTO) ? OTO : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("on-time-offloading.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("average-offloading-time.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(Number(averageOffloadingTime)) ? Number(averageOffloadingTime) : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("average-offloading-time.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("demurages-occurrences.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(DC) ? DC : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("demurages-occurrences.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("damurages-charged-days.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(Number(damuragesChargedDays)) ? Number(damuragesChargedDays) : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("damurages-charged-days.unit")}</div>
                </CardContent>
            </Card>
        </div>
    )
}
