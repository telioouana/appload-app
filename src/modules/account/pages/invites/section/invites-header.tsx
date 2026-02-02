"use client"

import { useTranslations } from "next-intl";

import { CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarGenerator } from "@/components/customs/avatar"

import { Invitation } from "@/modules/account/pages/invites/types/invitation-type";

type Props = {
    invitation: Invitation
}

export function InvitesHeader({ invitation }: Props) {
    const t = useTranslations("Account.organization.invites.header")

    return (
        <CardHeader className="w-full flex flex-col gap-4 items-center justify-center">
            <AvatarGenerator seed={invitation.organizationName} className={"size-32"} />
            <CardTitle className="text-center">{t("title", { organization: invitation.organizationName })}</CardTitle>
        </CardHeader>
    )
}
