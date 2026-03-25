"use client"

import { useTranslations } from "next-intl"

import { authClient } from "@/backend/auth/auth-client"

import { Skeleton } from "@/components/ui/skeleton"

import { TRIPS_PATH } from "../../../types/types"

export function TripsPageView({ path }: { path: TRIPS_PATH }) {
    const t = useTranslations(`Carrier.marketplace.page.trips.${path}`)
    const { data, isPending } = authClient.useActiveOrganization()

    if (isPending || !data) {
        return (
            <div className="flex flex-col gap-0.5">
                <Skeleton className="h-[calc(var(--text-2xl)+1rem)] w-36" />
                <Skeleton className="h-(--text-sm) w-64" />
            </div>
        )
    }

    const { name } = data

    return (
        <div className="flex flex-col gap-0.5">
            <h2 className="font-bold text-2xl leading-normal">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("description", { company: name })}</p>
        </div>
    )
}
