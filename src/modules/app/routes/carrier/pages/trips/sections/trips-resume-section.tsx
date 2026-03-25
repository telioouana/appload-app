"use client"

import { useTranslations } from "next-intl"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"

import { TRIPS_PATH } from "../../../types/types"
import { OrdersResumeCardView } from "../../../ui/views/orders-resume-card-view"

interface Props {
    path: TRIPS_PATH
    search?: string
    cargoType?: string
}

export function TripsResumeSection({ path, search, cargoType }: Props) {
    const t = useTranslations("Carrier.marketplace.trips.resume")

    const trpc = useTRPC()
    const {
        data: {
            trips,
            total,
            distance,
        }
    } = useSuspenseQuery(
        trpc.trips.resume.queryOptions({
            path,
            search: search?.trim() || undefined,
            cargoType: cargoType?.trim() || undefined,
        })
    )

    return (
        <OrdersResumeCardView 
            distance={distance}
            global={trips}
            total={total}
            t={t}
        />
    )
}