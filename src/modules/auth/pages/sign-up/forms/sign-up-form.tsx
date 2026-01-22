"use client"

import { z } from "zod"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import { CardDescription } from "@/components/ui/card"

import { GENDER, Step, TYPE } from "@/modules/auth/pages/sign-up/schema/validation"
import { AccountType } from "@/modules/auth/pages/sign-up/forms/steps/account-type"
import { UpdatePhone } from "@/modules/auth/pages/sign-up/forms/steps/update-phone"
import { PersonalDetails } from "@/modules/auth/pages/sign-up/forms/steps/personal-details"
import { OTPVerification } from "@/modules/auth/pages/sign-up/forms/steps/otp-verification"
import { CredentialsSetup } from "@/modules/auth/pages/sign-up/forms/steps/credentials-setup"

interface Props {
    callbackURL: string,
    step: Step
}

export function SignUpForm({ callbackURL, step }: Props) {
    const t = useTranslations("Auth.sign-up.form")
    const router = useRouter()

    const steps = [
        {
            id: "account-type",
            render: <AccountType key={"account-and-phone"} changeStep={changeStep} />
        },
        {
            id: "personal-details",
            render: <PersonalDetails key={"personal-details"} changeStep={changeStep} />
        },
        {
            id: "credentials-setup",
            render: <CredentialsSetup key={"credentials-setup"} changeStep={changeStep} />
        },
        {
            id: "otp-verification",
            render: <OTPVerification key={"otp-verification"} callbackURL={callbackURL} changeStep={changeStep} />
        },
        {
            id: "update-phone",
            render: <UpdatePhone key={"update-phone"} changeStep={changeStep} />
        },
    ]

    const SignUpFormSchema = z.object({
        step1: z.object({
            type: z.enum(TYPE),
        }),
        step2: z.object({
            country: z.string(),
            phoneNumber: z.string({ error: t("step2.phone-number.error.empty") }).min(9, { error: t("step2.phone-number.error.invalid") }).max(15, { error: t("step2.phone-number.error.invalid") }),
            name: z.string({ error: t("step2.name.error") }).nonempty({ error: t("step2.name.error") }),
            email: z.email({
                error: (issue) =>
                    issue.input == undefined || issue.input == ""
                        ? t("step2.email.error.empty")
                        : t("step2.email.error.invalid")
            }),
            gender: z.enum(GENDER, { error: t("step2.gender.error") }),
        }),
        step3: z.object({
            password: z.string({ error: t("step3.password.error.empty") }).min(8, { error: t("step3.password.error.invalid") }).max(32, { error: t("step3.password.error.invalid") }),
            confirm: z.string({ error: t("step3.confirm.error.empty") }),
        }).refine((data) => data.password === data.confirm, {
            error: t("step3.confirm.error.match"),
            path: ["confirm"]
        }),
        step4: z.object({
            code: z.string({ error: t("step4.code.error.empty") }).length(6, { error: t("step4.code.error.invalid") }),
        })
    })

    type SignUpFormType = z.infer<typeof SignUpFormSchema>

    const form = useForm<SignUpFormType>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            step1: { type: "shipper", },
            step2: { country: "Mozambique", },
        }
    })

    function changeStep(step: Step) {
        const url = new URL(window.location.href)
        url.searchParams.set("step", step)
        router.replace(url.href)
    }

    return (
        <FormProvider {...form}>
            <form className="flex flex-col gap-y-6">
                {steps.map(({ id, render }) => {
                    return id === step && render
                })}

                <CardDescription className="text-xs font-medium">{t("required")}</CardDescription>
            </form>
        </FormProvider>
    )
}