"use client"

import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";

export function IncidentsTab({ data }: { data: { [x: string]: unknown } }) {
    const t = useTranslations("Main.kpis.main.tabs.content.incidents")
    const f = useFormatter()
    const {
        trips = 0,
        totalAccidents = 0,
        mechanicalIssues = 0,
        documentationIssues = 0,
        policeIssues = 0,
        percentageDamagedCargo = 0,
        percentageComplains = 0,
    } = data

    const PDC = Number(percentageDamagedCargo) / Number(trips)
    const PC = Number(percentageComplains) / Number(trips)
    return (
        <div className="grid grid-cols-3 gap-8 pt-4 pb-2">
            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("total-accidents.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number(totalAccidents), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("total-accidents.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("mechanical-issues.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number(mechanicalIssues), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("mechanical-issues.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("documentation-issues.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number(documentationIssues), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("documentation-issues.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("police-issues.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number(policeIssues), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("police-issues.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("total-delays.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(Number(mechanicalIssues) + Number(documentationIssues) + Number(policeIssues), {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("total-delays.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("percentage-damaged-cargo.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(PDC) ? PDC : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("percentage-damaged-cargo.unit")}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex flex-col gap-4">
                    <div className="font-semibold text-sm h-8">{t("percentage-complains.label")}</div>
                    <div className="font-medium text-primary">
                        {f.number(!Number.isNaN(PC) ? PC : 0, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("percentage-complains.unit")}</div>
                </CardContent>
            </Card>
        </div>
    )
}
