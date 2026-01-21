"use client"

import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { SignInForm } from "@/modules/auth/pages/sign-in/form/sign-in-form"

interface Props {
    callback?: string
}

export function SignInView({ callback }: Props) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Auth.sign-in")
    
    const callbackURL = callback ?? DEFAULT_LOGIN_REDIRECT
    const encodedCallbackUrl = encodeURIComponent(callback!)


    return (
        <div className="grid gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
                <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
                <CardDescription className="text-muted-foreground text-balance">{t("description")}</CardDescription>
            </div>

            <SignInForm callbackURL={callbackURL} isPending={isPending} setPending={setPending}/>

            <div className="flex flex-col gap-y-1.5">
                <Link
                    href={`/forgot-password${callback != null ? `?callbackUrl=${encodedCallbackUrl}` : ""}`}
                    className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-fit text-xs")}
                >
                    {t("links.forgot")}
                </Link>

                <Link
                    href={`/sign-up?step=account-type${callback != null ? `&callbackUrl=${encodedCallbackUrl}` : ""}`}
                    className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-fit text-xs")}
                >
                    {t("links.sign-up")}
                </Link>
            </div>
        </div>
    )
}
