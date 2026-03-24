import { z } from "zod"
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
                values: OfferSchema
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { values } = input
            const { session } = ctx.auth

            if (!session.activeOrganizationId) throw new TRPCError({ code: "UNAUTHORIZED" })

            await db
                .insert(offer)
                .values({
                    orderId: values.orderId,
                    carrierId: values.carrierId,

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
        })
})