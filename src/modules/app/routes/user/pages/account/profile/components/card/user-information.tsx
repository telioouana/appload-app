"use client"

import Image from "next/image"

import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { IconChecks, IconCircleCheck, IconExclamationCircle, IconGenderBigender, IconMail, IconPhone } from "@tabler/icons-react"

import { User } from "@/backend/auth/types"
import { authClient } from "@/backend/auth/auth-client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

import { countryCodes } from "@/lib/country-codes"

interface Props {
    isPending: boolean
    user: User | undefined
}

export function UserInformation({ isPending, user }: Props) {
    const [isProcessing, setProcessing] = useState<boolean>(false)

    const t = useTranslations("User.account.profile.user-information")

    if (isPending || !user) {
        return (
            <Card className="p-0 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 md:p-6">
                    <Skeleton className="h-7 w-35 mb-4" />
                    <FieldGroup className="gap-y-4">
                        <Field className="gap-y-1">
                            <Skeleton className="h-3.75 w-25 mb-2" />
                            <Skeleton className="h-9 w-full" />
                        </Field>

                        <Field className="gap-y-1">
                            <FieldLabel
                                htmlFor="email"
                                className="text-sm text-gray-700 dark:text-gray-300 mb-2 block"
                            >
                                <div className="flex items-center gap-2">
                                    <IconMail className="size-4 text-muted-foreground" />
                                    <Skeleton className="h-3.75 w-25 mb-2" />
                                </div>
                            </FieldLabel>
                            <Skeleton className="h-9 w-full" />
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field className="gap-y-1">
                                <FieldLabel htmlFor="phone" className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                                    <div className="flex items-center gap-2">
                                        <IconPhone className="size-4 text-muted-foreground" />
                                        <Skeleton className="h-3.75 w-25 mb-2" />
                                    </div>
                                </FieldLabel>
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-20" />
                                    <Skeleton className="h-9 w-full flex-1" />
                                </div>
                            </Field>

                            <Field className="gap-y-1">
                                <FieldLabel
                                    htmlFor="gender"
                                    className="text-sm text-gray-700 dark:text-gray-300 mb-2 block"
                                >
                                    <div className="flex items-center gap-2">
                                        <IconGenderBigender className="size-4 text-muted-foreground" />
                                        <Skeleton className="h-3.75 w-25 mb-2" />
                                    </div>
                                </FieldLabel>
                                <Skeleton className="h-9 w-full" />
                            </Field>
                        </div>
                    </FieldGroup>
                </CardContent>
            </Card>
        )
    }

    const { email, emailVerified, gender, name, phoneNumber } = user

    async function handleSendEmail() {
        await authClient.sendVerificationEmail({
            email
        }, {
            onRequest: () => { setProcessing(true) },
            onSuccess: () => {
                // TODO: Localization
                toast.success("Email verification send, please check your email inbox")
                setProcessing(false)
            },
            onError: () => {
                // TODO: Localization
                toast.error("Failed to send the verification send, please try again")
                setProcessing(false)
            }
        })
    }

    const code = countryCodes.find(({ code }) => phoneNumber?.startsWith(code))?.code
    const iso = countryCodes.find(({ code }) => phoneNumber?.startsWith(code))?.iso
    const f = parsePhoneNumberFromString(phoneNumber!)

    return (
        <Card className="p-0 rounded-xl md:rounded-2xl border-[0.5px] border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 md:p-6">
                <h2 className="font-bold text-lg mb-4">{t("title")}</h2>

                <FieldGroup className="gap-y-4">
                    <Field className="gap-y-1">
                        <FieldLabel
                            htmlFor="name"
                            className="text-sm text-gray-700 dark:text-gray-300 mb-2 block"
                        >{t("name")}</FieldLabel>
                        <Input id="name" readOnly value={name} />
                    </Field>

                    <Field className="gap-y-1">
                        <FieldLabel
                            htmlFor="email"
                            className="text-sm text-gray-700 dark:text-gray-300 mb-2 block"
                        >
                            <div className="flex items-center gap-2">
                                <IconMail className="size-4 text-muted-foreground" />
                                {t("email.label")}
                            </div>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput id="email" readOnly type="email" value={email} />
                            <InputGroupAddon>
                                {emailVerified
                                    ? (
                                        <InputGroupText><IconCircleCheck className="text-emerald-500" /></InputGroupText>
                                    ) : (
                                        <InputGroupText><IconExclamationCircle className="text-amber-500" /></InputGroupText>
                                    )
                                }
                            </InputGroupAddon>

                            {!emailVerified
                                ? (
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton onClick={handleSendEmail} disabled={isProcessing} variant="default">
                                            {isProcessing && <Spinner />}
                                            {t("email.verify")}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                ) : (
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton variant="success">
                                            <IconChecks />
                                            {t("email.verified")}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                )
                            }
                        </InputGroup>
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field className="gap-y-1">
                            <FieldLabel htmlFor="phone" className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                                <div className="flex items-center gap-2">
                                    <IconPhone className="size-4 text-muted-foreground" />
                                    {t("phone")}
                                </div>
                            </FieldLabel>
                            <div className="flex gap-2">
                                <Button variant="outline" className="font-normal">
                                    <Image src={`/flags/${iso || "default"}.svg`} alt="flag" width={1} height={1} className="ml-2 size-4" priority />
                                    {code}
                                </Button>
                                <Input id="phone" readOnly type="tel" value={f?.formatNational()} className="flex-1" />
                            </div>
                        </Field>

                        <Field className="gap-y-1">
                            <FieldLabel
                                htmlFor="gender"
                                className="text-sm text-gray-700 dark:text-gray-300 mb-2 block"
                            >
                                <div className="flex items-center gap-2">
                                    <IconGenderBigender className="size-4 text-muted-foreground" />
                                    {t("gender.label")}
                                </div>
                            </FieldLabel>
                            <Input id="gender" readOnly type="text" value={t(`gender.${gender}`)} />
                        </Field>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}