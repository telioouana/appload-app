import Image from "next/image"
import { useTranslations } from "next-intl"
import { IconRefresh } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export function OrdersErrorFallback() {
    const t = useTranslations(`Main.error.orders`)

    return (
        <div className="h-full w-full items-center justify-center flex flex-col">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia>
                        <Image src="/error/oops.svg" alt="oops" width={200} height={200} className="h-full w-full" />
                    </EmptyMedia>
                    <EmptyTitle>{t("title")}</EmptyTitle>
                    <EmptyDescription>{t("description")}</EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Button onClick={() => window.location.reload()}>
                        {t("button")}
                        <IconRefresh />
                    </Button>
                </EmptyContent>
            </Empty>
        </div >
    )
}
