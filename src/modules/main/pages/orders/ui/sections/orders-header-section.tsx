"use client"

import { useTranslations } from "next-intl"

import { FilterType, SourceType, UserType } from "@/modules/main/ui/types"
import { CreateOrderDialog } from "@/modules/main/pages/order/ui/dialog/create-order-dialog"

type Props = {
    userType: UserType
    filter?: FilterType
    source?: SourceType
}

export function OrdersHeaderSection({ filter, source, userType }: Props) {
    const t = useTranslations("Main.orders.header")

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <div >
                    <h2 className="text-2xl font-bold">{t(`${userType}.${filter ?? "main"}`)}</h2>
                </div>

                {(userType === "shipper" && source) && (
                    <CreateOrderDialog publishTo={source === "private" ? "subscribers" : "non-subscribers"} />
                )}
            </div>
        </div>
    )
}
