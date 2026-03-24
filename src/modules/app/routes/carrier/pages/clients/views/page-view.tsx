"use client"

import { useTranslations } from "next-intl";

export function ClientsPageView() {
    const t = useTranslations("Carrier.clients.page")

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
            <p className="text-muted-foreground">{t("description")}</p>
        </div>
    )
}
