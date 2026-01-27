import Link from "next/link"
import { IconBuildingFactory } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

import { buttonVariants } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

import { cn } from "@/lib/utils"

export function EmptyOrganization() {
    const t = useTranslations("Account.organization.empty")

    return (
        <div className="h-full w-full items-center justify-center flex flex-col">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="size-36 rounded-full">
                        <IconBuildingFactory className="size-24" />
                    </EmptyMedia>
                    <EmptyTitle>{t("title")}</EmptyTitle>
                    <EmptyDescription>{t("description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Link href="/company/create?view=organization-info" className={cn(buttonVariants())}>{t("button")}</Link>
                </EmptyContent>
            </Empty>
        </div >
    )
}
