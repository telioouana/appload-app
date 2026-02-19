"use client"

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconUserCheck, IconUserX } from "@tabler/icons-react";

import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

import { Invitation } from "@/modules/account/pages/invites/types/invitation-type";
import { useState } from "react";

export function InvitesFooter({ invitation }: { invitation: Invitation }) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Account.organization.invites.footer")
    const router = useRouter()

    return (
        <CardFooter className="flex gap-4 items-center justify-between">
            <div className="w-full">
                <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => authClient.organization.rejectInvitation({
                        invitationId: invitation.id
                    }, {
                        onRequest: () => setPending(true),
                        onSuccess: () => {
                            setPending(false)
                            router.push("/company")
                        },
                        onError: () => setPending(false)
                    })}
                >
                    {t("button-reject")}
                    <IconUserX />
                </Button>
            </div>

            <div className="w-full">
                <Button
                    variant="default"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => authClient.organization.acceptInvitation({
                        invitationId: invitation.id
                    }, {
                        onRequest: () => setPending(true),
                        onSuccess: async () => {
                            try {
                                await authClient.organization.setActive({
                                    organizationId: invitation.organizationId
                                })
                                router.push("/company")
                            } catch (error) {
                                console.error("Failed to set active organization:", error)
                            } finally {
                                setPending(false)
                            }
                        },
                        onError: () => setPending(false)
                    })}
                >
                    {t("button-accept")}
                    <IconUserCheck />
                </Button>
            </div>
        </CardFooter>
    )
}
