import { z } from "zod"

import { FISCAL_REGIME, urlSchema } from "@/backend/db/types"

export const TYPE = ["shipper", "carrier"] as const

export type View = "organization-info" | "kyc-info"

export const CreateOrganizationSchema = z.object({
    info: z.object({
        type: z.enum(TYPE),
        country: z.string(),
        name: z.string().nonempty(),
        nuit: z.number().min(100000000).max(999999999),
        email: z.email(),
        phoneNumber: z.string().min(9,).max(15),
        billingAddress: z.string().nonempty(),
        physicalAddress: z.string().nonempty(),
    }),
    kyc: z.object({
        fiscalRegime: z.enum(FISCAL_REGIME).optional(),
        idCard: urlSchema.min(1).max(2),
        nuit: urlSchema.min(1).max(2),
        alvara: urlSchema.min(1).max(5),
        bankLetter: urlSchema.min(1).max(2),
        republicBulletin: urlSchema.min(1).max(2),
        commercialExercise: urlSchema.min(1).max(2),
        commercialCertificate: urlSchema.min(1).max(5),
    })
})
export type CreateOrganizationForm = z.infer<typeof CreateOrganizationSchema>