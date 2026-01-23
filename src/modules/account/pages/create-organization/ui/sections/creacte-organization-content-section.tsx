"use client"

import { z } from "zod"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { redirect, useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"

import { User } from "@/backend/auth/types"
import { FISCAL_REGIME } from "@/backend/db/types"

import { CardContent } from "@/components/ui/card";

import { KYCInfo } from "@/modules/account/pages/create-organization/ui/forms/kyc-info";
import { TYPE, View } from "@/modules/account/pages/create-organization/ui/schema/validation";
import { OrganizationInfo } from "@/modules/account/pages/create-organization/ui/forms/organization-info";

type Props = {
    user: User,
    view: View
}

export function CreacteOrganizationContentSection({ user, view }: Props) {
    if (user.type === "appload") redirect("/sign-in")

    const t = useTranslations("Account.organization.create.form")

    const CreateCompanySchema = z.object({
        info: z.object({
            type: z.enum(TYPE),
            country: z.string(),
            name: z.string({ error: t("info.name.error") }).nonempty({ error: t("info.name.error") }),
            nuit: z.number({ error: t("info.nuit.error.empty") }).min(100000000, { error: t("info.nuit.error.length") }).max(999999999, { error: t("info.nuit.error.length") }),
            email: z.email({
                error: (issue) =>
                    issue.input === undefined || issue.input === ""
                        ? t("info.email.error.empty")
                        : t("info.email.error.invalid")
            }),
            phoneNumber: z.string({ error: t("info.phone-number.error.empty") }).min(9, { error: t("info.phone-number.error.length") }).max(15, { error: t("info.phone-number.error.length") }),
            billingAddress: z.string({ error: t("info.billing-address.error") }).nonempty({ error: t("info.billing-address.error") }),
            physicalAddress: z.string({ error: t("info.physical-address.error") }).nonempty({ error: t("info.physical-address.error") }),
        }),
        kyc: z.object({
            fiscalRegime: z.enum(FISCAL_REGIME, { error: t("kyc.fiscal-regime.error") }),
            idCard: z.array(z.object({ url: z.url({ error: t("kyc.id-card.error.empty") }) })).min(1, { error: t("kyc.id-card.error.length") }).max(2, { error: t("kyc.id-card.error.length") }),
            nuit: z.array(z.object({ url: z.url({ error: t("kyc.nuit.error.empty") }) })).min(1, { error: t("kyc.nuit.error.length") }).max(2, { error: t("kyc.nuit.error.length") }),
            alvara: z.array(z.object({ url: z.url({ error: t("kyc.alvara.error.empty") }) })).min(1, { error: t("kyc.alvara.error.length") }).max(5, { error: t("kyc.alvara.error.length") }),
            bankLetter: z.array(z.object({ url: z.url({ error: t("kyc.bank-letter.error.empty") }) })).min(1, { error: t("kyc.bank-letter.error.length") }).max(2, { error: t("kyc.bank-letter.error.length") }),
            republicBulletin: z.array(z.object({ url: z.url({ error: t("kyc.republic-bulletin.error.empty") }) })).min(1, { error: t("kyc.republic-bulletin.error.length") }).max(2, { error: t("kyc.republic-bulletin.error.length") }),
            commercialExercise: z.array(z.object({ url: z.url({ error: t("kyc.commercial-exercise.error.empty") }) })).min(1, { error: t("kyc.commercial-exercise.error.length") }).max(2, { error: t("kyc.commercial-exercise.error.length") }),
            commercialCertificate: z.array(z.object({ url: z.url({ error: t("kyc.commercial-certificate.error.empty") }) })).min(1, { error: t("kyc.commercial-certificate.error.length") }).max(5, { error: t("kyc.commercial-certificate.error.length") }),
        })
    })

    type CreateCompanyForm = z.infer<typeof CreateCompanySchema>
    const form = useForm<CreateCompanyForm>({
        resolver: zodResolver(CreateCompanySchema),
        defaultValues: {
            info: {
                type: user.type as "shipper" | "carrier",
                country: "Mozambique",
            },
            kyc: {
                idCard: [{ url: "" }],
                nuit: [{ url: "" }],
                commercialCertificate: [{ url: "" }],
                ...(user.type === "carrier"
                    ? {
                        alvara: [{ url: "" }],
                        bankLetter: [{ url: "" }],
                        republicBulletin: [{ url: "" }],
                        commercialExercise: [{ url: "" }],
                    }
                    : {})
            }
        }
    })

    const router = useRouter()

    function changeView(view: View) {
        const url = new URL(window.location.href)
        url.searchParams.set("view", view)
        router.replace(url.href)
    }

    const views = [
        {
            id: "organization-info",
            render: <OrganizationInfo key={"account-and-phone"} changeView={changeView} />
        },
        {
            id: "kyc-info",
            render: <KYCInfo key={"personal-details"} changeView={changeView} />
        }
    ]

    return (
        <CardContent>
            <FormProvider {...form}>
                <form className="h-full flex items-center justify-center">
                    {views.map(({ id, render }) => {
                        return id === view && render
                    })}
                </form>
            </FormProvider>
        </CardContent>
    )
}
