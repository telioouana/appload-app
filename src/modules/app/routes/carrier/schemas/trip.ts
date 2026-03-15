import { z } from "zod";

import { CURRENCY, FISCAL_REGIME, WEIGHT_UNIT } from "@/backend/db/types";

export function createTripSchema(t: (key: string) => string) {
    const schema = z.object({
        orderId: z.string().nonempty(),
        carrierId: z.string().nonempty(),
        carrierName: z.string().nonempty(),

        driverId: z.string().nonempty(),
        driverName: z.string({ error: t("form.fields.name.error") }).nonempty({ error: t("form.fields.name.error") }),
        driverPhoneNumber: z.string({ error: t("form.fields.phone-number.error.empty") }).min(9, { error: t("form.fields.phone-number.error.invalid") }).max(15, { error: t("form.fields.phone-number.error.invalid") }),
        driverPassport: z.string().optional(),
        truckPlate: z.string({ error: t("form.fields.truck-plate.error") }).nonempty({ error: t("form.fields.truck-plate.error") }),
        truckAge: z.string({ error: t("form.fields.truck-age.error") }).nonempty({ error: t("form.fields.truck-age.error") }),
        trailerPlate: z.string().optional(),
        linkPlate: z.string().optional(),

        proposedLoadingDate: z.date(),
        proposedOffloadingDate: z.date(),

        weightUnit: z.enum(WEIGHT_UNIT),

        fiscalRegime: z.enum(FISCAL_REGIME),
        carrierSubtotal: z.number().nonnegative(),
        carrierVAT: z.number().nonnegative(),
        carrierTotal: z.number().nonnegative(),
        carrierCurrency: z.enum(CURRENCY),

        shipperSubtotal: z.number().nonnegative(),
        shipperVAT: z.number().nonnegative(),
        shipperTotal: z.number().nonnegative(),
        shipperCurrency: z.enum(CURRENCY),
    })

    return schema
}

export const TripSchema = createTripSchema((k) => k)