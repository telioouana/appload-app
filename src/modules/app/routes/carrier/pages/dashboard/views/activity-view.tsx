"use client"

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { IconCurrencyDollar, IconPackage, IconTruck, IconTruckDelivery } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";

import ActivityCard from "../components/card/activity-card";

export function ActivityView() {
    const t = useTranslations("Carrier.dashboard.activity")
    const f = useFormatter()
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.carrierDashboard.activity.queryOptions()
    )

    return (
        <Suspense fallback={<div>Loading activity...</div>}>
            <ErrorBoundary fallback={<div>Error loading activity.</div>}>
                <div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 gap-6">
                    <ActivityCard
                        Icon={IconPackage}
                        value={data.orders}
                        unit={t("orders")}
                    />

                    <ActivityCard
                        Icon={IconTruckDelivery}
                        value={data.trips}
                        unit={t("trips")}
                    />

                    <ActivityCard
                        Icon={IconTruck}
                        value={data.fleet}
                        unit={t("fleet")}
                    />

                    <ActivityCard
                        Icon={IconCurrencyDollar}
                        value={f.number(data.revenue, {
                            currency: "MZN",
                            currencyDisplay: "code",
                            currencySign: "accounting",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            compactDisplay: "long"
                        })}
                        unit={t("revenue")}
                    />
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
