"use client"

import { useTranslations } from "next-intl"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"

import { ORDERS_PATH } from "../../../types/types"
import { OrdersResumeCardView } from "../../../ui/views/orders-resume-card-view"

interface Props {
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}

export function OrdersResumeSection({ path, search, cargoType }: Props) {
    const t = useTranslations("Carrier.marketplace.orders.resume")

    const trpc = useTRPC()
    const {
        data: {
            orders,
            total,
            distance,
        }
    } = useSuspenseQuery(
        trpc.orders.resume.queryOptions({
            path,
            search: search?.trim() || undefined,
            cargoType: cargoType?.trim() || undefined,
        })
    )

    return (
        <OrdersResumeCardView 
            distance={distance}
            global={orders}
            total={total}
            t={t}
        />
    )
}