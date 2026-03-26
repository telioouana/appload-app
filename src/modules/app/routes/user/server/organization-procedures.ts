import { z } from "zod"
import { eq, or } from "drizzle-orm";

import { db } from "@/backend/db";
import { organization, kyc } from "@/backend/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init";

import { CreateOrganizationSchema } from "../pages/account/organization/schemas/organization";

export const organizationRouter = createTRPCRouter({
    validate: protectedProcedure
        .input(
            z.object({
                email: z.email(),
                phoneNumber: z.string().min(9).max(15),
                nuit: z.string().regex(/^\d{9}$/),
            })
        )
        .query(async ({ input }) => {
            const { email, phoneNumber, nuit } = input

            const existing = await db
                .select()
                .from(organization)
                .where(
                    or(
                        eq(organization.nuit, nuit),
                        eq(organization.email, email),
                        eq(organization.phoneNumber, phoneNumber),
                    )
                );

            return {
                hasNuit: existing.some((org) => org.nuit === nuit),
                hasEmail: existing.some((org) => org.email === email),
                hasPhone: existing.some((org) => org.phoneNumber === phoneNumber),
            };
        }),

    legal: protectedProcedure
        .input(
            z.object({
                organizationId: z.string().nonempty(),
                type: z.enum(["shipper", "carrier"]),
                values: CreateOrganizationSchema
            })
        )
        .mutation(async ({ input }) => {
            const { organizationId, type, values: { kyc: files } } = input

            await db
                .insert(kyc)
                .values({
                    organizationId,
                    idCard: files.idCard,
                    nuit: files.nuit,
                    ...(type === "carrier") && {
                        fiscalReginme: files.fiscalRegime,
                        alvara: files.alvara,
                        bankLetter: files.bankLetter,
                        republicBulletin: files.republicBulletin,
                        commercialExercise: files.commercialExercise,
                    },
                    ...(files.commercialCertificate[0].url !== "") && {
                        commercialCertificate: files.commercialCertificate
                    }
                })
                .onConflictDoUpdate({
                    target: kyc.organizationId,
                    set: files,
                })
        })
})