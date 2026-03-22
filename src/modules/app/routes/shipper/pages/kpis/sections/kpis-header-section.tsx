"use client"

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function KPIsHeaderSection() {
    const t = useTranslations("Shipper.kpis.page.header")
    return (
        <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold leading-tight">{t("title")}</h1>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <Button
                size="lg"
                className="hidden"
            >
                {t("button")}
            </Button>
        </div>
    )
}
