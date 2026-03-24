"use client"

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconChecks, IconClock, IconPackages, IconPencilMinus, IconTruckDelivery } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";

import ActivityCard from "../components/card/activity-card";

export function ActivityView() {
    const t = useTranslations("Shipper.dashboard.activity")
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.shipperDashboard.activity.queryOptions()
    )

    return (
        <Suspense fallback={<div>Loading activity...</div>}>
            <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold">{t("title")}</h2>

                    <div className="flex flex-col gap-4">
                        <h2 className="font-medium">{t("private")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <ActivityCard
                                Icon={IconPackages}
                                value={data.private.orders}
                                unit={t("orders")}
                                href="/s/private/orders/all"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconPencilMinus}
                                value={data.private.drafted}
                                unit={t("drafted")}
                                href="/s/private/orders/drafted"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconClock}
                                value={data.private.open}
                                unit={t("open")}
                                href="/s/private/orders/open"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconClock}
                                value={data.private.booked}
                                unit={t("booked")}
                                href="/s/private/orders/booked"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconTruckDelivery}
                                value={data.private.shipped}
                                unit={t("on-going")}
                                href="/s/private/orders/shipped"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconChecks}
                                value={data.private.delivered}
                                unit={t("delivered")}
                                href="/s/private/orders/delivered"
                                label={t("link")}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="font-medium">{t("public")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <ActivityCard
                                Icon={IconPackages}
                                value={data.public.orders}
                                unit={t("orders")}
                                href="/s/public/orders/all"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconPencilMinus}
                                value={data.public.drafted}
                                unit={t("drafted")}
                                href="/s/public/orders/drafted"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconClock}
                                value={data.public.open}
                                unit={t("open")}
                                href="/s/public/orders/open"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconClock}
                                value={data.public.booked}
                                unit={t("booked")}
                                href="/s/public/orders/booked"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconTruckDelivery}
                                value={data.public.shipped}
                                unit={t("on-going")}
                                href="/s/public/orders/shipped"
                                label={t("link")}
                            />

                            <ActivityCard
                                Icon={IconChecks}
                                value={data.public.delivered}
                                unit={t("delivered")}
                                href="/s/public/orders/delivered"
                                label={t("link")}
                            />
                        </div>
                    </div>
                </div>

            </ErrorBoundary>
        </Suspense>
    )
}
