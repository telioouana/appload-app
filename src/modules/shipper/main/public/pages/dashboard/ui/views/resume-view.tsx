"use client"

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

import { useTRPC } from "@/backend/trpc/client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PERIOD } from "@/modules/shipper/main/types/types";
import { ResumeCard } from "../card/resume-card";

export function ResumeView({ endDate: initialEndDate, startDate: initialStartDate }: { endDate: Date, startDate: Date }) {
    const [dates, setDates] = useState({ start: initialStartDate, end: initialEndDate });
    const [period, setPeriod] = useState<PERIOD>("month")

    const t = useTranslations("Shipper.main.dashboard.resume")
    const f = useFormatter()
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.dashboard.resume.queryOptions({
            startDate: dates.start,
            endDate: dates.end
        })
    )

    function periodChange(newPeriod: PERIOD) {
        const now = new Date()

        let start: Date;
        let end: Date;

        switch (newPeriod) {
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

        setDates({ start, end });
        setPeriod(newPeriod);
    }

    return (
        <Suspense fallback={<div>Loading resume...</div>}>
            <ErrorBoundary fallback={<div>Error loading resume.</div>}>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex w-full justify-center items-center">
                        <Tabs value={period} onValueChange={(value) => periodChange(value as PERIOD)}>
                            <TabsList>
                                <TabsTrigger value="month" >{t("tabs.month")}</TabsTrigger>
                                <TabsTrigger value="quarter" >{t("tabs.quarter")}</TabsTrigger>
                                <TabsTrigger value="year" >{t("tabs.year")}</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{t("card.title")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <ResumeCard
                                    value={data.trips}
                                    unit={t("card.trips.unit")}
                                    label={t("card.trips.label")}
                                />

                                <ResumeCard
                                    value={data.deliveries}
                                    unit={t("card.deliveries.unit")}
                                    label={t("card.deliveries.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.totalAmount, {
                                        currency: "MZN",
                                        currencyDisplay: "code",
                                        currencySign: "accounting",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        compactDisplay: "long"
                                    })}
                                    unit={t("card.total-amount.unit")}
                                    label={t("card.total-amount.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.averagePrice, {
                                        currency: "MZN",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        currencyDisplay: "code",
                                        currencySign: "accounting",
                                        compactDisplay: "long"
                                    })}
                                    unit={t("card.average-price.unit")}
                                    label={t("card.average-price.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.totalWeight, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                    unit={t("card.loaded-weight.unit")}
                                    label={t("card.loaded-weight.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.averageWeight, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                    unit={t("card.average-weight.unit")}
                                    label={t("card.average-weight.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.distanceCovered / 1000, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                    unit={t("card.total-distance.unit")}
                                    label={t("card.total-distance.label")}
                                />

                                <ResumeCard
                                    value={f.number(data.averageDistance / 1000, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    })}
                                    unit={t("card.average-distance.unit")}
                                    label={t("card.average-distance.label")}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
