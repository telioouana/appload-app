import { z } from "zod"

export const TYPE = ["shipper", "carrier"] as const
export const GENDER = ["male", "female", "other"] as const

export type Step = "account-type" | "personal-details" | "credentials-setup" | "otp-verification" | "update-phone"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignUpFormSchema = z.object({
    step1: z.object({
        type: z.enum(TYPE),
    }),
    step2: z.object({
        country: z.string(),
        phoneNumber: z.string().min(9).max(15),
        name: z.string(),
        email: z.email(),
        gender: z.enum(GENDER),
    }),
    step3: z.object({
        password: z.string().min(8).max(32),
        confirm: z.string(),
    }).refine((data) => data.password === data.confirm, {
        path: ["confirm"]
    }),
    step4: z.object({
        code: z.string().length(6),
    })
})

export type SignUpForm = z.infer<typeof SignUpFormSchema>