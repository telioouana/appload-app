"use client"

import { useTranslations } from "next-intl";

import { CardHeader, CardTitle } from "@/components/ui/card";

export function CreacteOrganizationHeaderSection() {
    const t = useTranslations("Account.organization.create.header")
    return (
        <CardHeader>
            <CardTitle className="text-2xl">{t("title")}</CardTitle>
        </CardHeader>
    )
}
