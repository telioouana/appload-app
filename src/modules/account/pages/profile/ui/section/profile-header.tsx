import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { IconKey } from "@tabler/icons-react"

import { Account } from "@/backend/auth/types"
import { authClient } from "@/backend/auth/auth-client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProfileHeader() {
    const [account, setAccount] = useState<Account | null>(null)

    const t = useTranslations("Account.profile.header")

    useEffect(() => {
        async function loadAccounts() {
            const { data } = await authClient.listAccounts()

            if (data) setAccount(data[0])
        }

        loadAccounts()
    }, [])

    if (!account) {
        return (
            <div className="py-10 px-6 flex items-center justify-between">
                <div className="text-2xl font-semibold">{t("title")}</div>

                <div className="flex gap-4 items-center">
                    <Skeleton className="bg-secondary dark:bg-seconday/50 rounded-full size-8" />

                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-10 px-6 flex items-center justify-between">
            <div className="text-2xl font-semibold">{t("title")}</div>


            <Link href="/profile/change-password" className="flex gap-4 items-center group">
                <div className="bg-secondary dark:bg-seconday/50 rounded-full size-8 flex items-center justify-center group-hover:bg-primary group-hover:dark:bg-primary">
                    <IconKey className="size-4" />
                </div>

                <div className="flex flex-col gap-1 group-hover:text-primary group-hover:dark:text-primary">
                    <p className="text-xs font-medium">{t("link.label")}</p>
                    <p className="text-xs opacity-60">
                        {account.updatedAt.getDate !== account.createdAt.getDate
                            ? <span>{t("link.updated", { updated: account.updatedAt })}</span>
                            : <span>{t("link.never")}</span>
                        }
                    </p>
                </div>
            </Link>
        </div>
    )
}
