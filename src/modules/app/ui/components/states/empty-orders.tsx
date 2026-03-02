import { useTranslations } from "next-intl"
import { IconPackages } from "@tabler/icons-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { authClient } from "@/backend/auth/auth-client"
import { Spinner } from "@/components/ui/spinner"

type User = "shipper" | "carrier"

export function EmptyOrders() {
    const { data, isPending } = authClient.useSession()

    if (isPending || !data?.user) return <Spinner />

    return <Render type={data.user.type as User} />
}

function Render({ type }: { type: User }) {
    const t = useTranslations(`States.orders.empty.${type}`)

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
