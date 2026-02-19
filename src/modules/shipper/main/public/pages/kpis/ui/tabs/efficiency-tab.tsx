"use client"

import { useFormatter, useTranslations } from "next-intl";

import { CURRENCY } from "@/backend/db/types";

import { KPIsDataCard } from "../cards/kpis-data-card";

export function EfficiencyTab({ currency, data }: { currency: typeof CURRENCY[number], data: { [x: string]: unknown } }) {
    const t = useTranslations("Shipper.main.kpis.page.data.tabs.efficiency")
    const f = useFormatter()
    const {
        trips,
        backload,
        emissions,
        total,
    } = data

    const BT = Number(backload) / Number(trips) * 100

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <KPIsDataCard
                value={f.number(Number.isFinite(BT) ? BT : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("backload.label")}
                unit={t("backload.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(emissions) ? Number(emissions) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("emissions.label")}
                unit={t("emissions.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(total) ? Number(total) : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                currency={currency}
                label={t("saved-with-backload.label")}
                unit={t(`saved-with-backload.unit.${currency}`)}
            />
        </div>
    )
}
