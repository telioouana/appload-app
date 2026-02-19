"use client"

import { useFormatter, useTranslations } from "next-intl";

import { KPIsDataCard } from "../cards/kpis-data-card";

export function OperationalTab({ data }: { data: { [x: string]: unknown } }) {
    const t = useTranslations("Shipper.main.kpis.page.data.tabs.operational")
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

    const rawDC = Number(demuragesOccurrences) / Number(trips) * 100
    const rawOTL = Number(onTimeAtLoading) / Number(trips) * 100
    const rawOTO = Number(onTimeAtOffloading) / Number(trips) * 100
    const rawADCD = Number(distance) / Number(trips) / Number(averageTravelTime) / 1000

    const DC = Number.isFinite(rawDC) ? rawDC : 0
    const OTL = Number.isFinite(rawOTL) ? rawOTL : 0
    const OTO = Number.isFinite(rawOTO) ? rawOTO : 0
    const ADCD = Number.isFinite(rawADCD) ? rawADCD : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <KPIsDataCard
                value={f.number(!Number.isNaN(OTL) ? OTL : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("on-time-loading.label")}
                unit={t("on-time-loading.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(Number(averageLoadingTime)) ? Number(averageLoadingTime) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("average-loading-time.label")}
                unit={t("average-loading-time.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(Number(averageTravelTime)) ? Number(averageTravelTime) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("average-travel-time.label")}
                unit={t("average-travel-time.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(ADCD) ? ADCD : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("average-daily-distance.label")}
                unit={t("average-daily-distance.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(OTO) ? OTO : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("on-time-offloading.label")}
                unit={t("on-time-offloading.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(Number(averageOffloadingTime)) ? Number(averageOffloadingTime) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("average-offloading-time.label")}
                unit={t("average-offloading-time.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(DC) ? DC : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("demurages-occurrences.label")}
                unit={t("demurages-occurrences.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(Number(damuragesChargedDays)) ? Number(damuragesChargedDays) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("damurages-charged-days.label")}
                unit={t("damurages-charged-days.unit")}
            />
        </div>
    )
}
