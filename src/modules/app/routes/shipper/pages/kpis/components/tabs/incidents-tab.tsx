"use client"

import { useFormatter, useTranslations } from "next-intl";

import { KPIsDataCard } from "../cards/kpis-data-card";

export function IncidentsTab({ data }: { data: { [x: string]: unknown } }) {
    const t = useTranslations("Shipper.kpis.page.data.tabs.incidents")
    const f = useFormatter()

    const {
        trips,
        totalAccidents,
        mechanicalIssues,
        documentationIssues,
        policeIssues,
        percentageDamagedCargo,
        percentageComplaints,
    } = data

    const rawPC = Number(percentageComplaints) / Number(trips) * 100
    const rawPDC = Number(percentageDamagedCargo) / Number(trips) * 100

    console.log(percentageDamagedCargo, rawPDC)

    const PC = Number.isFinite(rawPC) ? rawPC : 0
    const PDC = Number.isFinite(rawPDC) ? rawPDC : 0
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <KPIsDataCard
                value={f.number(Number(totalAccidents), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("total-accidents.label")}
                unit={t("total-accidents.unit")}
            />

            <KPIsDataCard
                value={f.number(Number(mechanicalIssues), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("mechanical-issues.label")}
                unit={t("mechanical-issues.unit")}
            />

            <KPIsDataCard
                value={f.number(Number(documentationIssues), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("documentation-issues.label")}
                unit={t("documentation-issues.unit")}
            />

            <KPIsDataCard
                value={f.number(Number(policeIssues), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("police-issues.label")}
                unit={t("police-issues.unit")}
            />

            <KPIsDataCard
                value={f.number(Number(mechanicalIssues) + Number(documentationIssues) + Number(policeIssues), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("total-delays.label")}
                unit={t("total-delays.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(PDC) ? PDC : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("percentage-damaged-cargo.label")}
                unit={t("percentage-damaged-cargo.unit")}
            />

            <KPIsDataCard
                value={f.number(!Number.isNaN(PC) ? PC : 0, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}
                label={t("percentage-complains.label")}
                unit={t("percentage-complains.unit")}
            />
        </div>
    )
}
