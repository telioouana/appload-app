import Link from "next/link"
import { useTranslations } from "next-intl"
import { parsePhoneNumberFromString } from "libphonenumber-js"


import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { User } from "@/backend/auth/types"

type Props = {
    user: User
}

export function AccountInfo({ user }: Props) {
    const { email, phoneNumber } = user

    const t = useTranslations("Account.profile.account-info")
    const f = parsePhoneNumberFromString(phoneNumber!)

    return (
        <Card className="border-none">
            <CardHeader className="inline-flex justify-between items-center">
                <div>
                    <CardTitle>{t("title")}</CardTitle>
                </div>
                <div className="text-sm">
                    <Link href="/profile/sign-in-preferences" className="text-primary hover:text-primary/90 cursor-pointer hover:underline hover:underline-offset-4">
                        {t("links.edit-account")}
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="border-t py-4 flex justify-between items-center gap-4 text-sm">
                    <div className="inline-flex gap-2 justify-between items-center w-full">
                        <span className="text-muted-foreground w-full">{t("email.label")}</span>
                        <span className="font-semibold w-full">{email}</span>
                    </div>
                    <div className="flex justify-end w-full items-end">{t("email.description")}</div>
                </div>

                <Separator />

                <div className="border-b py-4 flex justify-between items-center gap-4 text-sm">
                    <div className="inline-flex gap-2 leading-1 justify-between items-center w-full">
                        <span className="text-muted-foreground w-full">{t("phone-number.label")}</span>
                        <span className="font-semibold w-full">{f?.formatInternational()}</span>
                    </div>
                    <div className="flex justify-end w-full items-end">{t("phone-number.description")}</div>
                </div>
            </CardContent>
            <CardFooter className="inline-flex gap-x-8 items-center text-sm">
                <Link href="/profile/sign-in-preferences" className="text-primary hover:text-primary/90 cursor-pointer hover:underline hover:underline-offset-4">{t("links.sign-in")}</Link>
                <Link href="/profile/change-password" className="text-primary hover:text-primary/90 cursor-pointer hover:underline hover:underline-offset-4">{t("links.password")}</Link>
                <Link href="/profile/close-account" className="text-primary hover:text-primary/90 cursor-pointer hover:underline hover:underline-offset-4">{t("links.close")}</Link>
            </CardFooter>
        </Card>
    )
}