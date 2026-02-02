"use client"

import { useTranslations } from "next-intl";

import { CardContent } from "@/components/ui/card";
import { Invitation } from "@/modules/account/pages/invites/types/intivation-type";

export function InvitesContent({ invitation }: { invitation: Invitation }) {
    const t = useTranslations("Account.organization.invites.content")

    return (
        <CardContent className="flex flex-col gap-4 text-sm">
            <p className="space-x-2 text-justify">
                <span className="font-semibold">{invitation.inviterEmail}</span>
                <span className="text-muted-foreground">{t("inviter")}</span>
            </p>

            <div className="flex flex-col gap-2">
                <p className="text-justify">{t("features.label")}</p>
                <ul className="list-disc pl-8">
                    <li className="space-x-2">
                        <span className="font-semibold">{t("features.one.title")}</span>
                        <span className="text-muted-foreground">{t("features.one.description")}</span>
                    </li>
                    <li className="space-x-2">
                        <span className="font-semibold">{t("features.two.title")}</span>
                        <span className="text-muted-foreground">{t("features.two.description")}</span>
                    </li>
                    <li className="space-x-2">
                        <span className="font-semibold">{t("features.three.title")}</span>
                        <span className="text-muted-foreground">{t("features.three.description")}</span>
                    </li>
                </ul>
            </div>
        </CardContent>
    )
}
