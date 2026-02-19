"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PERIOD } from "@/modules/shipper/main/types/types";


export function KPIsDataWindowSection({ setDates }: { setDates: ({start, end}: {start: Date, end: Date}) => void }) {
    const [period, setPeriod] = useState<PERIOD>("month")

    const t = useTranslations("Shipper.main.kpis.page.data-window")
    const router = useRouter()

    function periodChange(newPeriod: PERIOD) {
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

        const url = new URL(window.location.href)
        url.searchParams.set("period", newPeriod)

        router.replace(url.href)

        setDates({ start, end });
        setPeriod(newPeriod);
    }

    return (
        <div className="flex w-full justify-center items-center">
            <Tabs value={period} onValueChange={(value) => periodChange(value as PERIOD)}>
                <TabsList>
                    <TabsTrigger value="month">{t("month")}</TabsTrigger>
                    <TabsTrigger value="quarter">{t("quarter")}</TabsTrigger>
                    <TabsTrigger value="year">{t("year")}</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}
