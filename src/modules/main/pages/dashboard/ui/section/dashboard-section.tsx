"use client"

import { useTranslations } from "next-intl"

import { authClient } from "@/backend/auth/auth-client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

import { CreateOrderDialog } from "@/modules/main/pages/order/ui/dialog/create-order-dialog"

export function DashboardSection() {
    const { data, isPending } = authClient.useSession()
    const t = useTranslations("Main.dashboard.main")

    if (isPending) {
        return <div>Loading...</div>
    }
    
    return (
        <Card className="bg-primary/30 w-full">
            <CardContent className="flex justify-between items-center py-6">
                <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-3xl">{t("title", { name: data?.user.name ?? ""})}</CardTitle>
                <CardDescription>{t(`description.${data?.user.type}`)}</CardDescription>
                </div>
                
                <CreateOrderDialog />
            </CardContent>
        </Card>
    )
}
