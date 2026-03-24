import { z } from "zod"

import { FISCAL_REGIME } from "@/backend/db/types"

export const TYPE = ["shipper", "carrier"] as const

export function OrganizationSchema(t: (key: string) => string) {
    return z.object({
        info: z.object({
            type: z.enum(TYPE),
            country: z.string(),
            name: z.string({ error: t("info.name.error") }).nonempty({ error: t("info.name.error") }),
            nuit: z.string({ error: t("info.nuit.error.empty") }).regex(/^\d{9}$/, { error: t("info.nuit.error.length") }),
            email: z.email({
                error: (issue) =>
                    issue.input === undefined || issue.input === ""
                        ? t("info.email.error.empty")
                        : t("info.email.error.invalid")
            }),
            phoneNumber: z.string({ error: t("info.phone-number.error.empty") }).min(9, { error: t("info.phone-number.error.length") }).max(15, { error: t("info.phone-number.error.length") }),
            billingAddress: z.object({
                address: z.string({ error: t("info.billing-address.error") }).nonempty({ error: t("info.billing-address.error") }),
                placeId: z.string().nonempty(),
                country: z.string().nonempty(),
                state: z.string().nonempty(),
            }),
            physicalAddress: z.object({
                address: z.string({ error: t("info.physical-address.error") }).nonempty({ error: t("info.physical-address.error") }),
                placeId: z.string().nonempty(),
                country: z.string().nonempty(),
                state: z.string().nonempty(),
            }),
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
}

export const CreateOrganizationSchema = OrganizationSchema((k: string) => k)
export type CreateOrganizationForm = z.infer<ReturnType<typeof OrganizationSchema>>