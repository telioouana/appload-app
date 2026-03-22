"use client"

import { Account } from "better-auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IconKey, IconShield } from "@tabler/icons-react";

import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { User } from "../types/types";
import { useTwoFactorAuth } from "../hooks/use-two-factor-auth";
import { TwoFactorAuthDialog } from "../components/dialog/two-factor-auth-dialog";

interface Props {
    user: User
}

export function SecurityView({ user }: Props) {
    const [account, setAccount] = useState<Account | undefined>(undefined)

    const { onOpenChange: twoFactor } = useTwoFactorAuth()

    const t = useTranslations("User.account.security-and-privacy.security")

    useEffect(() => {
        async function loadAccounts() {
            const { data } = await authClient.listAccounts()
            if (data) {
                const acc = data.find((account) => account.userId === user.id)
                setAccount(acc)
            }
        }

        loadAccounts()
    }, [user.id])

    function handle2AF() {
        twoFactor(user.twoFactorEnabled ?? false)
    }

    return (
        <Card className="p-0">
            <TwoFactorAuthDialog />
            <CardContent className="p-4 md:p-6 rounded-xl md:rounded-2xl">
                <CardHeader className="p-0 mb-4">
                    <h2 className="font-bold text-lg">{t("header")}</h2>
                </CardHeader>

                <div className="space-y-4">
                    <Card className="p-0 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CardContent className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <IconShield className="size-5 text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t("two-factor.title")}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{t("two-factor.description")}</p>
                                </div>
                            </div>

                            {user.twoFactorEnabled
                                ? (
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handle2AF}
                                    >
                                        {t("two-factor.actions.disable")}
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handle2AF}
                                    >
                                        {t("two-factor.actions.enable")}
                                    </Button>
                                )
                            }
                        </CardContent>
                    </Card>

                    <Card className="p-0 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <CardContent className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <IconKey className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t("password.title")}</p>
                                    {!account
                                        ? (
                                            <Skeleton className="h-3 w-30 mt-1" />
                                        ) : (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {account.updatedAt.getTime() === account.createdAt.getTime()
                                                    ? (
                                                        t("password.description.never")
                                                    ) : (
                                                        t("password.description.updated-at", { updatedAt: account.updatedAt })
                                                    )
                                                }
                                            </p>
                                        )
                                    }

                                </div>
                            </div>
                            <Button variant="outline" size="sm">{t("password.actions.change")}</Button>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
