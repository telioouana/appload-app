"use client"

import { useFormatter, useTranslations } from "next-intl";

import { CURRENCY } from "@/backend/db/types";

import { KPIsDataCard } from "../cards/kpis-data-card";

export function CostsTab({ currency, data }: { currency: typeof CURRENCY[number], data: { [x: string]: unknown } }) {
    const t = useTranslations("Carrier.kpis.page.data.tabs.costs")
    const f = useFormatter()
    const {
        trips,
        distance,
        weight,
        total,
    } = data

    const rawCPK = (Number(total) / (Number(distance) / 1000)) / Number(trips)
    const rawCPU = (Number(total) / Number(weight)) / Number(trips)
    const rawCPUK = Number(total) / ((Number(distance) / 1000) * Number(weight))

    const CPK = Number.isFinite(rawCPK) ? rawCPK : 0
    const CPU = Number.isFinite(rawCPU) ? rawCPU : 0
    const CPUK = Number.isFinite(rawCPUK) ? rawCPUK : 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <KPIsDataCard
                value={f.number(!Number.isNaN(CPK) ? CPK : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                currency={currency}
                label={t("cost-per-km.label")}
                unit={t("cost-per-km.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(CPU) ? CPU : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                currency={currency}
                label={t("cost-per-unit.label")}
                unit={t("cost-per-unit.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(CPUK) ? CPUK : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                currency={currency}
                label={t("cost-per-unit-km.label")}
                unit={t("cost-per-unit-km.unit")}
            />
        </div>
    )
}
