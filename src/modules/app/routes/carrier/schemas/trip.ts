import { z } from "zod";

import { AddressSchema, CURRENCY, FISCAL_REGIME, TRIP_STATUS, TRIP_TYPE, TRUCK_AGE, WEIGHT_UNIT } from "@/backend/db/types";

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
        truckAge: z.enum(TRUCK_AGE, { error: t("form.fields.truck-age.error") }),
        trailerPlate: z.string().optional(),
        linkPlate: z.string().optional(),

        loading: AddressSchema,
        proposedLoadingDate: z.date(),
        offloading: AddressSchema,
        proposedOffloadingDate: z.date(),
        distance: z.number(),
        tripType: z.enum(TRIP_TYPE),

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

export function manageTripSchema(t: (key: string) => string) {
    return z.object({
        tripId: z.string().nonempty(),
        trackingId: z.string().optional(),
        truckPlate: z.string().nonempty(),
        location: z.object({
            address: z.string({ error: t("") }).nonempty({ error: t("") }),
            placeId: z.string().nonempty(),
            country: z.string().nonempty(),
            state: z.string().nonempty(),
        }),
        status: z.enum(TRIP_STATUS, { error: t("") })
    })
}

export const TripSchema = createTripSchema((k) => k)