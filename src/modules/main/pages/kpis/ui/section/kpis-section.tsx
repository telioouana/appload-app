"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CURRENCY } from "@/backend/db/types";
import { useTRPC } from "@/backend/trpc/client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { UserType } from "@/modules/main/ui/types";
import { Period, Tab } from "@/modules/main/pages/kpis/ui/types";
import { CostsTab } from "@/modules/main/pages/kpis/ui/tabs/costs-tab";
import { IncidentsTab } from "@/modules/main/pages/kpis/ui/tabs/incidents-tab";
import { EfficiencyTab } from "@/modules/main/pages/kpis/ui/tabs/efficiency-tab";
import { OperationalTab } from "@/modules/main/pages/kpis/ui/tabs/operational-tab";

type Props = {
    endDate: Date
    startDate: Date
    userType: UserType
}

export default function KPIsSection({ endDate: initialEndDate, startDate: initialStartDate, userType }: Props) {
    const [tab, setTab] = useState<Tab>("operational")
    const [period, setPeriod] = useState<Period>("month")
    const [currency, setCurrency] = useState<typeof CURRENCY[number]>("MZN")

    // Manage date state locally so the UI and Queries update on period change
    const [dates, setDates] = useState({ start: initialStartDate, end: initialEndDate });

    const t = useTranslations("Main.kpis.main")
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.kpis.all.queryOptions({
            endDate: dates.end,
            currency,
            startDate: dates.start,
            section: tab,
        })
    )

    function periodChange(newPeriod: Period) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        let start: Date;
        let end: Date;

        switch (newPeriod) {
            case "month":
                // First and last day of previous month
                start = new Date(year, month - 1, 1);
                end = new Date(year, month, 0);
                break;
            case "quarter":
                // First and last day of previous quarter
                const currentQuarterStartMonth = Math.floor(month / 3) * 3;
                start = new Date(year, currentQuarterStartMonth - 3, 1);
                end = new Date(year, currentQuarterStartMonth, 0);
                break;
            case "year":
                // First and last day of previous year
                start = new Date(year - 1, 0, 1);
                end = new Date(year - 1, 11, 31);
                break;
            default:
                return;
        }

        console.log("Start: ", start, "End: ", end)
        setDates({ start, end });
        setPeriod(newPeriod);
    }

    return (
        <Card>
            <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
                <CardHeader className="flex flex-row justify-between items-center space-y-0">
                    <TabsList className="w-1/2">
                        <TabsTrigger value="operational">{t("tabs.triggers.title.operational")}</TabsTrigger>
                        <TabsTrigger value="incidents">{t("tabs.triggers.title.incidents")}</TabsTrigger>
                        <TabsTrigger value="costs">{t("tabs.triggers.title.costs")}</TabsTrigger>
                        <TabsTrigger value="efficiency">{t("tabs.triggers.title.efficiency")}</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-3">
                        <Tabs value={period} onValueChange={(value) => periodChange(value as Period)}>
                            <TabsList>
                                <TabsTrigger value="month">{t("tabs.triggers.period.month")}</TabsTrigger>
                                <TabsTrigger value="quarter">{t("tabs.triggers.period.quarter")}</TabsTrigger>
                                <TabsTrigger value="year">{t("tabs.triggers.period.year")}</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="hidden">
                            <Select
                                value={currency}
                                onValueChange={(value) => setCurrency(value as typeof CURRENCY[number])}
                            >
                                <SelectTrigger className="border-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCY.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <TabsContent value="operational">
                        <OperationalTab data={data} />
                    </TabsContent>
                    <TabsContent value="incidents">
                        <IncidentsTab data={data} />
                    </TabsContent>
                    <TabsContent value="costs">
                        <CostsTab data={data} />
                    </TabsContent>
                    <TabsContent value="efficiency">
                        <EfficiencyTab currency={currency} data={data} userType={userType} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}