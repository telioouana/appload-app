import { z } from "zod";

import { CURRENCY, LOADING_BAY, TRUCK_AGE } from "@/backend/db/types";

export function createOfferSchema(t: (key: string) => string) {
    const schema = z.object({
        orderId: z.string().nonempty(),
        carrierId: z.string().nonempty(),

        driverId: z.string().nonempty(),
        driverName: z.string({ error: t("form.fields.name.error") }).nonempty({ error: t("form.fields.name.error") }),
        driverPhoneNumber: z.string({ error: t("form.fields.phone-number.error.empty") }).min(9, { error: t("form.fields.phone-number.error.invalid") }).max(15, { error: t("form.fields.phone-number.error.invalid") }),
        driverPassport: z.string().optional(),
        truckPlate: z.string({ error: t("form.fields.truck-plate.error") }).nonempty({ error: t("form.fields.truck-plate.error") }),
        truckAge: z.enum(TRUCK_AGE, { error: t("form.fields.truck-age.error") }),
        trailerPlate: z.string().optional(),
        linkPlate: z.string().optional(),
        type: z.enum(LOADING_BAY),

        proposedLoadingDate: z.date(),
        proposedOffloadingDate: z.date(),
        price: z.string({ error: t("form.price.error") }),
        currency: z.enum(CURRENCY),
    })

    return schema
}

export const OfferSchema = createOfferSchema((k: string) => k)
export type OfferSchemaForm = z.infer<typeof OfferSchema>