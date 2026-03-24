"use client"

import { useTranslations } from "next-intl"

export function HeaderView() {
    const t = useTranslations("User.account.organization.views.header")
    
    return (
        <div>
            <h2 className="text-xl font-bold">{t("title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
    )
}
