"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconTrash } from "@tabler/icons-react";

import { Member } from "@/backend/auth/types";
import { authClient } from "@/backend/auth/auth-client";

import { useConfirm } from "@/hooks/use-confirm";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerator } from "@/components/customs/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    member: Member
}

export function MemberCard({ member }: Props) {
    const t = useTranslations("User.account.organization.views.team.member-card")

    const [isPending, setPending] = useState<boolean>(false)
    const router = useRouter()

    const { role, user: { name, email, image } } = member

    function avatar(className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    function changeRole(role: "admin" | "member") {
        setPending(true)
        authClient.organization.updateMemberRole({
            role,
            memberId: member.id
        }, {
            onSuccess: () => {
                router.refresh()
                setPending(false)
            },
            onError: () => setPending(false)
        })
    }

    const [ConfirmDialog, confirm] = useConfirm("User.account.organization.views.team.member-card.confirm") as [React.ComponentType, () => Promise<boolean>]
    async function removeMember() {
        const ok = await confirm()
        if (ok) {
            setPending(true)
            authClient.organization.removeMember({
                memberIdOrEmail: member.id
            }, {
                onSuccess: () => {
                    router.refresh()
                    setPending(false)
                },
                onError: () => setPending(false)
            })
        }

    }

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <ConfirmDialog />
            <div className="flex items-center gap-3">
                {avatar("size-10")}
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{email}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {role === "owner"
                    ? (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded">{t("role.owner")}</span>
                    ) : (
                        <>
                            <Select value={role} onValueChange={changeRole} disabled={true}>
                                <SelectTrigger className="w-40 h-8 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent position="popper" align="end">
                                    <SelectItem value="admin">{t("role.admin")}</SelectItem>
                                    <SelectItem value="member">{t("role.member")}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                size="sm"
                                disabled={true}
                                variant="destructive"
                                onClick={removeMember}
                            >
                                <IconTrash className="size-4" />
                            </Button>
                        </>
                    )}
            </div>
        </div>
    )
}
