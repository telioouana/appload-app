import Link from "next/link"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { Step } from "@/modules/auth/pages/sign-up/schema/validation"
import { SignUpForm } from "@/modules/auth/pages/sign-up/forms/sign-up-form"

interface Props {
    callback?: string,
    step: Step
}

export function SignUpView({ callback, step }: Props) {
    const t = useTranslations("Auth.sign-up")
    
    const callbackURL = callback ?? DEFAULT_LOGIN_REDIRECT
    const encodedCallbackUrl = encodeURIComponent(callback!)

    return (
        <div className="grid gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
                <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
                <CardDescription className="text-muted-foreground text-balance">{t("description")}</CardDescription>
            </div>

            <SignUpForm callbackURL={callbackURL} step={step} />

            <div className="flex flex-col gap-y-1.5">
                <Link
                    href={`/sign-in${callback != null ? `?callbackUrl=${encodedCallbackUrl}` : ""}`}
                    className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-fit text-xs")}
                >
                    {t("links.sign-in")}
                </Link>
            </div>
        </div>
    )
}