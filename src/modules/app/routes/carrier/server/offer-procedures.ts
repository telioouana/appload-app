import { z } from "zod"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

import { db } from "@/backend/db"
import { offer } from "@/backend/db/schema"
import { LOADING_BAY, TRUCK_AGE } from "@/backend/db/types"
import { createTRPCRouter, protectedProcedure } from "@/backend/trpc/init"

import { OfferSchema } from "../schemas/offer"

export const offerRouter = createTRPCRouter({
    send: protectedProcedure
        .input(
            z.object({
                offerId: z.string().optional(),
                values: OfferSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx.auth
            const { offerId, values } = input

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            if (offerId) {
                await db
                    .update(offer)
                    .set({
                        driverId: values.driverId,
                        driverName: values.driverName,
                        driverPhoneNumber: values.driverPhoneNumber,
                        driverPassport: values.driverPassport,
                        truckPlate: values.truckPlate,
                        truckAge: values.truckAge as typeof TRUCK_AGE[number],
                        trailerPlate: values.trailerPlate,
                        linkPlate: values.linkPlate,
                        type: values.type as typeof LOADING_BAY[number],

                        status: "updated",
                    
                        proposedLoadingDate: values.proposedLoadingDate,
                        proposedOffloadingDate: values.proposedOffloadingDate,
                        price: values.price,
                        currency: values.currency
                    })
                    .where(eq(offer.id, offerId))
            } else {
                await db
                    .insert(offer)
                    .values({
                        orderId: values.orderId,
                        carrierId: values.carrierId,
                        carrierName: values.carrierName,

                        driverId: values.driverId,
                        driverName: values.driverName,
                        driverPhoneNumber: values.driverPhoneNumber,
                        driverPassport: values.driverPassport,
                        truckPlate: values.truckPlate,
                        truckAge: values.truckAge as typeof TRUCK_AGE[number],
                        trailerPlate: values.trailerPlate,
                        linkPlate: values.linkPlate,
                        type: values.type as typeof LOADING_BAY[number],

                        proposedLoadingDate: values.proposedLoadingDate,
                        proposedOffloadingDate: values.proposedOffloadingDate,
                        price: values.price,
                        currency: values.currency
                    })
            }
        })
})