"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { IconMailExclamation } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, } from "@/components/ui/item"

import { authClient } from "@/backend/auth/auth-client"

export function EmailVerification() {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Account.email-verification")
    const { data } = authClient.useSession()
    
    if (!data?.user || data.user.emailVerified) return null
    
    const { email } = data.user
    
    async function handleSendEmail() {
        await authClient.sendVerificationEmail({
            email
        }, {
            onRequest: () => { setPending(true) },
            onSuccess: () => {
                // TODO: Localization
                toast.success("Email verification send, please check your email inbox")
                setPending(false)
            },
            onError: () => {
                // TODO: Localization
                toast.error("Failed to send the verification send, please try again")
                setPending(false)
            }
        })
    }

    return (
        <Item size="sm" variant="outline" className="bg-primary/5 border-primary">
            <ItemMedia variant="icon" className="bg-primary rounded-full size-10">
                <IconMailExclamation className="size-6" />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{t("title")}</ItemTitle>
                <ItemDescription>{t("description")}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button size="sm" onClick={handleSendEmail} disabled={isPending}>
                    {t("button")}
                </Button>
            </ItemActions>
        </Item>
    )
}