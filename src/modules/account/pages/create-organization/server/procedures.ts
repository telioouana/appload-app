"use server"

import { eq } from "drizzle-orm"
import { APIError } from "better-auth"

import { db } from "@/backend/db"
import { kyc, organization } from "@/backend/db/schema"

import { CreateOrganizationForm } from "@/modules/account/pages/create-organization/ui/schema/validation"

export async function checkNuit(nuit: number) {
    const company = await db
        .query
        .organization
        .findFirst({
            where: eq(organization.nuit, nuit)
        })

    if (company) throw new APIError("CONFLICT")

    return {
        status: "OK"
    }
}

export async function inferKYC(values: CreateOrganizationForm, organizationId: string) {
    const [data] = await db
        .insert(kyc)
        .values({
            organizationId,
            ...values.kyc,
        })
        .returning()

    if (!data) throw new APIError("BAD_REQUEST")

    return {
        status: "OK"
    }
}

export async function listSubscribers() {}