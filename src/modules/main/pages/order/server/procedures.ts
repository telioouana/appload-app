import { z } from "zod"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

import { db } from "@/backend/db"
import { cargo, order, organization, trip } from "@/backend/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"
import { CreateOrderSchema, ORDER_STATUS, TripSchema } from "@/backend/db/types"

import { distanceCalculator } from "@/lib/google"

export const orderRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                orderId: z.string().optional(),
                status: z.enum(ORDER_STATUS),
                values: CreateOrderSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { orderId, status, values } = input

            const result = await distanceCalculator(values.loadingAddress[0].placeId, values.offloadingAddress[0].placeId)

            const distance = result?.[0].elements[0].distance.value ?? 0

            if (orderId) {
                await db
                    .update(order)
                    .set({
                        status,
                        distance: distance,
                        ...values
                    })
                    .where(eq(order.id, orderId))

                await db
                    .update(cargo)
                    .set({
                        category: values.cargo.category,
                        description: values.cargo.description,
                        quantity: String(values.cargo.quantity),
                        unit: values.cargo.unit,
                        packing: values.cargo.packing,
                        isHazardous: values.cargo.isHazardous,
                        hazchemCode: values.cargo.hazchemCode,
                        isRefrigerated: values.cargo.isRefrigerated,
                        temperature: Number(values.cargo.temperature),
                        temperatureInstructions: values.cargo.temperatureInstructions,
                        isGroupageAllowed: values.cargo.isGroupageAllowed,
                    })
                    .where(eq(cargo.orderId, orderId))
            } else {
                if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })
                const shipper = await db.query.organization.findFirst({ where: eq(organization.id, session.activeOrganizationId) })

                const [load] = await db
                    .insert(order)
                    .values({
                        status,
                        shipperId: session.activeOrganizationId,
                        shipperName: shipper?.name ?? "",
                        distance: distance,
                        route: values.loadingAddress[0].country == values.offloadingAddress[0].country ? "national" : "regional",
                        ...values
                    })
                    .returning()

                if (!load) throw new TRPCError({ code: "BAD_REQUEST" })

                await db
                    .insert(cargo)
                    .values({
                        orderId: load.id,
                        category: values.cargo.category,
                        description: values.cargo.description,
                        quantity: String(values.cargo.quantity),
                        unit: values.cargo.unit,
                        packing: values.cargo.packing,
                        isHazardous: values.cargo.isHazardous,
                        hazchemCode: values.cargo.hazchemCode,
                        isRefrigerated: values.cargo.isRefrigerated,
                        temperature: Number(values.cargo.temperature),
                        temperatureInstructions: values.cargo.temperatureInstructions,
                        isGroupageAllowed: values.cargo.isGroupageAllowed,
                    })
            }
        }),

    accept: protectedProcedure
        .input(
            z.object({
                values: TripSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })
            
            await db
            .insert(trip)
            .values({
                ...values
            })
        })
})