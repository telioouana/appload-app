import { useTranslations } from "next-intl"
import { IconPackages } from "@tabler/icons-react"

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

import { UserType } from "@/modules/main/ui/types"
// import { CreateOrderDialog } from "@/modules/main/pages/orders/ui/dialog/create-order-dialog"

type Props = {
    userType: UserType
}

export function EmptyOrders({ userType }: Props) {
    const t = useTranslations(`Main.orders.empty.${userType}`)

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
                {userType == "shipper" && (
                    <EmptyContent>
                        {/* <CreateOrderDialog /> */}
                    </EmptyContent>
                )}
            </Empty>
        </div >
    )
}
