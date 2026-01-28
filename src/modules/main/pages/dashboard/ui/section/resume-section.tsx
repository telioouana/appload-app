"use client"

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/backend/trpc/client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserType } from "@/modules/main/ui/types";


export function ResumeSection({ userType }: { userType: UserType }) {
    const [date, setDate] = useState<Date>(new Date())
    const [tab, setTab] = useState("month")

    const t = useTranslations("Main.dashboard.resume")
    const f = useFormatter()
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.dashboard.resume.queryOptions()
    )

    function tabChange(tab: string) {
        if (tab === "week") setDate(new Date(date.getDate() - 7))
        if (tab === "month") setDate(new Date(date.getDate() - 30))
        if (tab === "year") setDate(new Date(date.getDate() - 365))
        setTab(tab)
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex w-full justify-center items-center">
                <Tabs value={tab} onValueChange={tabChange}>
                    <TabsList>
                        <TabsTrigger value="week" >{t("tabs.week")}</TabsTrigger>
                        <TabsTrigger value="month" >{t("tabs.month")}</TabsTrigger>
                        <TabsTrigger value="year" >{t("tabs.year")}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex flex-col gap-8">
                <div className="text-xl font-semibold">{t("card.title")}</div>
                <div className="grid grid-cols-4 gap-8">
                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.trips.label`)}</div>
                            <div className="font-medium text-primary">
                                {data.trips}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.trips.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.deliveries.label`)}</div>
                            <div className="font-medium text-primary">
                            {data.deliveries}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.deliveries.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.total-amount.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.totalAmount, {
                                    currency: "MZN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.total-amount.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.average-price.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.averagePrice, {
                                    currency: "MZN",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.average-price.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.loaded-weight.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.totalWeight, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.loaded-weight.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.average-weight.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.averageWeight, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.average-weight.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.total-distance.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.distanceCovered / 1000, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.total-distance.unit`)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="font-semibold text-sm">{t(`card.${userType}.average-distance.label`)}</div>
                            <div className="font-medium text-primary">
                                {f.number(data.averageDistance / 1000, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">{t(`card.${userType}.average-distance.unit`)}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
