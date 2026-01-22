import { z } from "zod";

const ROLE = ["admin", "member", "owner"] as const
const COMPANY_STATUS = ["active", "closed", "pending"] as const
const INVITATION_STATUS = ["pending", "accepted", "rejected", "canceled"] as const

export const TYPE = ["shipper", "carrier"] as const
export const INVITE_ROLE = ["admin", "member"] as const

export const MembersTableSchema = z.object({
    user: z.object({
        image: z.url().optional(),
        name: z.string(),
        email: z.email(),
    }),
    role: z.enum(ROLE),
    createdAt: z.date()
})

export const InvitationsTableSchema = z.object({
    name: z.string(),
    email: z.email(),
    role: z.string(),
    status: z.enum(INVITATION_STATUS),
    createdAt: z.date(),
    expiresAt: z.date(),
})

export const SubscribersTableSchema = z.object({
    logo: z.string().nullable().optional(),
    name: z.string(),
    email: z.email(),
    status: z.enum(COMPANY_STATUS),
})

export const InviteMemberSchema = z.object({
    name: z.string(),
    email: z.email(),
    role: z.enum(INVITE_ROLE),
})

export const OrganizationFormSchema = z.object({
    type: z.enum(TYPE),
    country: z.string(),
    name: z.string().nonempty(),
    nuit: z.number().min(100000000).max(999999999),
    email: z.email(),
    phoneNumber: z.string().min(9,).max(15),
    billingAddress: z.string().nonempty(),
    physicalAddress: z.string().nonempty(),
})

export type InviteMemberForm = z.infer<typeof InviteMemberSchema>
export type OrganizationForm = z.infer<typeof OrganizationFormSchema>