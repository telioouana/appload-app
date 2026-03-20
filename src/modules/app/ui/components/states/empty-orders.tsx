"use client"

import { useTranslations } from "next-intl"
import { IconPackages, IconSearchOff } from "@tabler/icons-react" // Added search off icon

import { authClient } from "@/backend/auth/auth-client"

import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

type User = "shipper" | "carrier"

interface EmptyOrdersProps {
    isSearch?: boolean
}

export function EmptyOrders({ isSearch = false }: EmptyOrdersProps) {
    const { data, isPending } = authClient.useSession()

    if (isPending || !data?.user) return (
        <div className="flex h-30 w-full items-center justify-center">
            <Spinner />
        </div>
    )

    return <Render type={data.user.type as User} isSearch={isSearch} />
}

function Render({ type, isSearch }: { type: User; isSearch: boolean }) {
    // Switch the translation namespace based on whether we are searching or not
    const namespace = isSearch
        ? `States.orders.search` // Make sure to add this to your JSON
        : `States.orders.empty.${type}`

    const t = useTranslations(namespace)

    return (
        <div className="h-full w-full items-center justify-center flex flex-col">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="size-30 rounded-full bg-muted/30">
                        {isSearch ? (
                            <IconSearchOff className="size-20 text-muted-foreground" stroke={1.2} />
                        ) : (
                            <IconPackages className="size-20 text-muted-foreground" stroke={1.2} />
                        )}
                    </EmptyMedia>
                    <EmptyTitle className="mt-4">{t("title")}</EmptyTitle>
                    <EmptyDescription>{t("description")}</EmptyDescription>
                    {/* Only show the note if it's not a search result */}
                    {!isSearch && <EmptyDescription className="text-xs">{t("note")}</EmptyDescription>}
                </EmptyHeader>
            </Empty>
        </div>
    )
}