"use client"

import { useTranslations } from "next-intl"
import { IconPlus } from "@tabler/icons-react"

import { Invitation, Member } from "@/backend/auth/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { MemberCard } from "../components/card/member-card"

interface Props {
    members: Member[]
    invitations: Invitation[]
}

export function TeamManagementView({ members, invitations }: Props) {
    const t = useTranslations("User.account.organization.views.team.header")
    return (
        <Card className="p-0 rounded-xl md:rounded-2xl">
            <CardContent className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-gray-900 dark:text-white">{t("section-title")}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t("description")}</p>
                    </div>

                    <Button size="sm" className="hidden">
                        <IconPlus className="size-4" />
                        {t("actions.invite")}
                    </Button>
                </div>

                <div className="space-y-3">
                    {members.map((member) => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>

                {invitations.filter((invitation) => invitation.status === "pending").length > 0 && (
                    <>
                        <h2 className="text-gray-900 dark:text-white mb-4">{t("invitation-title")}</h2>

                        <div className="space-y-3">
                            {invitations.filter((invitation) => invitation.status === "pending").map((invitation) => (
                                <div key={invitation.id} >{invitation.name}</div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
