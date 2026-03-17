"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PERIOD } from "../../../types/types";

interface Props {
    setDates: ({start, end}: {start: Date, end: Date}) => void
    time?: PERIOD
}

export function KPIsDataWindowSection({ setDates, time }: Props) {
    const [period, setPeriod] = useState<PERIOD>(time ?? "month")

    const t = useTranslations("Shipper.kpis.page.data-window")
    const router = useRouter()

    function periodChange(newPeriod: PERIOD) {
        const now = new Date();
        // const year = now.getFullYear();
        // const month = now.getMonth();

        let start: Date;
        let end: Date;

        switch (newPeriod) {
            case "week":
                start = new Date(now.setDate(now.getDate() - 7));
                end = new Date();
                break;
            case "month":
                start = new Date(now.setDate(now.getDate() - 30));
                end = new Date();
                break;
            case "quarter":
                start = new Date(now.setDate(now.getDate() - 90));
                end = new Date();
                break;
            case "year":
                start = new Date(now.setDate(now.getDate() - 365));
                end = new Date();
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
                    <TabsTrigger value="week">{t("week")}</TabsTrigger>
                    <TabsTrigger value="month">{t("month")}</TabsTrigger>
                    <TabsTrigger value="quarter">{t("quarter")}</TabsTrigger>
                    <TabsTrigger value="year">{t("year")}</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}
