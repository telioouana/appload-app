import { z } from "zod";

export const CURRENCY = ["MZN", "ZAR", "USD"] as const
export const TRIP_TYPE = ["backload", "normal"] as const
export const TRUCK_AGE = ["recent", "not-recent"] as const
export const WEIGHT_UNIT = ["ton", "kg", "liter"] as const
export const ROUTE_TYPE = ["national", "regional"] as const
export const SHARE = ["subscribers", "non-subscribers"] as const
export const FISCAL_REGIME = ["normal", "simplified-5", "simplified-3"] as const
export const INSURANCE_PAYMENT_STATUS = ["pending", "paid", "not-applicable"] as const
export const POD_STATUS = ["pending-collection", "pending-delivery", "delivered", "verified"] as const
export const PAYMENT_STATUS = ["pending", "partially", "completed", "cancelled", "not-applicable"] as const
export const ORDER_STATUS = ["prospect", "drafted", "pending", "on-going", "delivered", "completed", "cancelled"] as const
export const TRIP_STATUS = ["booked", "at-loading", "loading", "waiting-documents", "in-transit", "stopped", "at-border", "at-offloading", "offloading", "completed"] as const
export const CATEGORIES = ["agriculture-inputs", "agriculture-products", "construction", "machinery-equipment", "fmcg", "general-cargo", "medicine", "mining", "oil-gas", "vehicles", "other"] as const
export const PACKING = ["bags-1kg", "bags-2kg", "bags-5kg", "bags-25kg", "bags-30kg", "bags-50kg", "bags-100kg", "bags-1ton", "bottle-1l", "bottle-5l", "bottle-10l", "bottle-20l", "bottle-25l", "container-20ft", "container-40ft", "boxes", "pallets", "noPacking", "other"] as const

export const urlSchema = z.array(z.object({
    url: z.url()
}))

export const LocationSchema = z.array(z.object({
    address: z.string(),
    placeId: z.string(),
    country: z.string(),
})).length(1)

export const CargoSchema = z.object({
    category: z.enum(CATEGORIES),
    description: z.string(),
    quantity: z.number(),
    unit: z.enum(WEIGHT_UNIT),
    packing: z.enum(PACKING),
    isHazardous: z.boolean(),
    hazchemCode: z.string().optional(),
    isRefrigerated: z.boolean(),
    temperature: z.number().optional(),
    temperatureInstructions: z.string().optional(),
    isGroupageAllowed: z.boolean(),
})
    .refine((data) => !data.isHazardous || !!data.hazchemCode, {
        error: "Hazchem required",
        path: ["hazchemCode"]
    })
    .refine((data) => !data.isRefrigerated || data.temperature !== undefined, {
        error: "Temperature required",
        path: ["temperature"]
    })

export const TripSchema = z.object({
    orderId: z.string(),
    carrierId: z.string(),
    carrierName: z.string(),

    driverId: z.string().nullable(),
    driverName: z.string().nullable(),
    driverPassport: z.string().nullable(),
    driverPhoneNumber: z.string().nullable(),
    truckPlate: z.string().nullable(),
    truckAge: z.enum(TRUCK_AGE).nullable(),
    trailerPlate: z.string().nullable(),
    linkPlate: z.string().nullable(),

    proposedLoadingDate: z.date(),
    arrivalAtLoading: z.date().nullable(),
    arrivalOnTimeLoading: z.boolean(),
    actualLoadingDate: z.date().nullable(),
    departureLoadingDate: z.date().nullable(),
    daysSpendLoading: z.number().nullable(),

    daysSpendTraveling: z.number().nullable(),

    proposedOffloadingDate: z.date(),
    arrivalAtOffloading: z.date().nullable(),
    arrivalOnTimeOffloading: z.boolean(),
    actualOffloadingDate: z.date().nullable(),
    departureOffloadingDate: z.date().nullable(),
    daysSpendOffloading: z.number().nullable(),

    demurageCharged: z.boolean(),
    totalDemurageChargedDays: z.number().nullable(),
    arrivalAtBorder: z.date().nullable(),
    departureFromBorder: z.date().nullable(),

    loadedWeight: z.string().nullable(),
    offloadedWeight: z.string().nullable(),
    weightUnit: z.enum(WEIGHT_UNIT),

    tripType: z.enum(TRIP_TYPE).nullable(),
    deliveries: z.number().nullable(),
    podStatus: z.enum(POD_STATUS).nullable(),
    status: z.enum(TRIP_STATUS),

    carrierInvoiceNumber: z.string().nullable(),
    carrierInvoiceDate: z.date().nullable(),
    fiscalRegime: z.enum(FISCAL_REGIME).nullable(),
    carrierSubtotal: z.string(),
    carrierVAT: z.string(),
    carrierTotal: z.string(),
    carrierCurrency: z.enum(CURRENCY).nullable(),
    carrierPaidPartially: z.string().nullable(),
    carrierPaidAmount: z.string().nullable(),
    carrierPaidPercentage: z.string().nullable(),
    carrierPaymentStatus: z.enum(PAYMENT_STATUS),
    carrierRemainingAmount: z.string().nullable(),
    carrierRemainingPercentage: z.string().nullable(),
    carrierFullPaymentDate: z.date().nullable(),

    insuranceSubscriber: z.string().nullable(),
    insuranceValue: z.string(),
    insuranceCurrency: z.enum(CURRENCY).nullable(),
    insuranceStatus: z.enum(INSURANCE_PAYMENT_STATUS).nullable(),

    apploadCommissionSubtotal: z.string(),
    apploadCommissionVAT: z.string(),
    apploadCommissionTotal: z.string(),

    shipperInvoiceNumber: z.string().nullable(),
    shipperInvoiceDate: z.date().nullable(),
    shipperSubtotal: z.string(),
    shipperVAT: z.string(),
    shipperTotal: z.string(),
    shipperCurrency: z.enum(CURRENCY).nullable(),
    shipperPaidPartially: z.string().nullable(),
    shipperPaidAmount: z.string().nullable(),
    shipperPaidPercentage: z.string().nullable(),
    shipperPaymentStatus: z.enum(PAYMENT_STATUS),
    shipperRemainingAmount: z.string().nullable(),
    shipperRemainingPercentage: z.string().nullable(),
    shipperFullPaymentDate: z.date().nullable(),
})

export const OrderSchema = z.object({
    loadingAddress: LocationSchema,
    expectedLoadingDate: z.date(),
    offloadingAddress: LocationSchema,
    expectedOffloadingDate: z.date(),

    expectedTrucks: z.number(),

    share: z.enum(SHARE)
})

export const CreateOrderSchema = z.object({
    loadingAddress: LocationSchema,
    expectedLoadingDate: z.date(),
    offloadingAddress: LocationSchema,
    expectedOffloadingDate: z.date(),

    expectedTrucks: z.number(),

    cargo: CargoSchema,

    share: z.enum(SHARE)
})

export const TripsTableSchema = z.object({
    order: OrderSchema,
    cargo: CargoSchema,
    trip: TripSchema
})

export type Urls = z.infer<typeof urlSchema>;
export type Location = z.infer<typeof LocationSchema>
export type CreateOrderForm = z.infer<typeof CreateOrderSchema>
