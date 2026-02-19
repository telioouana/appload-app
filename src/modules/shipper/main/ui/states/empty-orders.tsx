import { useTranslations } from "next-intl"
import { IconPackages } from "@tabler/icons-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export function EmptyOrders() {
    const t = useTranslations("Main.orders.empty.shipper")

    return (
        <div className="h-full w-full items-center justify-center flex flex-col">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="size-36 rounded-full">
                        <IconPackages className="size-24" />
                    </EmptyMedia>
                    <EmptyTitle>{t("title")}</EmptyTitle>
                    <EmptyDescription>{t("description")}</EmptyDescription>
                    <EmptyDescription>{t("note")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div >
    )
}
