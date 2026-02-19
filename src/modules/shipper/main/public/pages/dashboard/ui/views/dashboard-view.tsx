"use client"

import { useTranslations } from "next-intl"

import { authClient } from "@/backend/auth/auth-client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export function DashboardView() {
    const { data, isPending } = authClient.useSession()
    const t = useTranslations("Shipper.main.dashboard.page")

    if (isPending) {
        return <div>Loading...</div>
    }

    return (
        <Card className="bg-primary/20 w-full">
            <CardContent className="flex justify-between items-center py-2">
                <div className="flex flex-col gap-2">
                    <CardTitle className="font-bold text-3xl">{t("title", { name: data?.user.name ?? "" })}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </div>
            </CardContent>
        </Card>
    )
}
