"use client"

import { useTranslations } from "next-intl"

export function PageView() {
    const t = useTranslations("Shipper.market-data.page")
    return (
        <div>
            <h2 className="text-2xl font-semibold">{t("title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
    )
}
