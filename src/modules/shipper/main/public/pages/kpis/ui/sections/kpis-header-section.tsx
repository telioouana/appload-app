"use client"

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function KPIsHeaderSection() {
    const t = useTranslations("Shipper.main.kpis.page.header")
    return (
        <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold leading-tight">{t("title")}</h1>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <Button
                size="lg"
            >
                {t("button")}
            </Button>
        </div>
    )
}
