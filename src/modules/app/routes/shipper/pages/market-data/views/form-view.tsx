"use client"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { IconExclamationCircle } from "@tabler/icons-react"

export function FormView() {
    const t = useTranslations("Shipper.market-data.form")
    return (
        <Card className="p-0">
            <CardHeader className="p-8">
                <CardTitle className="text-xl font-semibold">{t("header.title")}</CardTitle>

                <div className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <IconExclamationCircle className="text-destructive" stroke={1.5} />
                </div>
            </CardHeader>
        </Card>
    )
}
