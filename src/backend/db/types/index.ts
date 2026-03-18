import { z } from "zod";

export const CURRENCY = ["MZN", "ZAR", "USD"] as const
export const TRIP_TYPE = ["backload", "normal"] as const
export const TRUCK_AGE = ["recent", "not-recent"] as const
export const WEIGHT_UNIT = ["ton", "kg", "liter"] as const
export const ROUTE_TYPE = ["national", "regional"] as const
export const MARKET_STATUS = ["pending", "completed"] as const
export const FLEET_STATUS = ["active", "idle", "free"] as const
export const SHARE = ["subscribers", "non-subscribers"] as const
export const TRUCK_TYPE = ["articulated", "non-articulated"] as const
export const FISCAL_REGIME = ["normal", "simplified-5", "simplified-3"] as const
export const INSURANCE_PAYMENT_STATUS = ["pending", "paid", "not-applicable"] as const
export const POD_STATUS = ["pending-collection", "pending-delivery", "delivered", "verified"] as const
export const PAYMENT_STATUS = ["pending", "partially", "completed", "cancelled", "not-applicable"] as const
export const ORDER_STATUS = ["prospect", "drafted", "open", "booked", "on-going", "delivered", "completed", "cancelled"] as const
export const LOADING_BAY = ["flatbed", "dropsides", "tautliner", "rigid-body", "refrigerated", "tipper", "side-tipper", "tanker", "lowbed"] as const
export const CATEGORIES = ["agriculture-inputs", "agriculture-products", "construction", "machinery-equipment", "fmcg", "general-cargo", "medicine", "mining", "oil-gas", "vehicles", "other"] as const
export const TRIP_STATUS = ["booked", "to-loading", "at-loading", "loading", "waiting-documents", "on-route", "stopped", "issue", "at-border", "at-offloading", "offloading", "completed", "cancelled"] as const
export const PACKING = ["bags-1kg", "bags-2kg", "bags-5kg", "bags-25kg", "bags-30kg", "bags-50kg", "bags-100kg", "bags-1ton", "bottle-1l", "bottle-5l", "bottle-10l", "bottle-20l", "bottle-25l", "container-20ft", "container-40ft", "boxes", "pallets", "noPacking", "other"] as const
export const YEARS = ["1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"] as const

export const urlSchema = z.array(z.object({ url: z.url() }))

export const statusSchema = z.array(
    z.object({
        status: z.enum(TRIP_STATUS),
        date: z.date()
    })
)

export const loadingBaySchema = z.object({
    width: z.number().positive(),
    length: z.number().positive(),
    height: z.number().positive(),
    volume: z.number().positive(),
    capacity: z.number().positive(),
    type: z.enum(LOADING_BAY)
})

export const LocationSchema = z.array(z.object({
    address: z.string(),
    placeId: z.string(),
    country: z.string(),
    state: z.string(),
})).length(1)

export const MarketResponse = z.object({
    minPrice: z.number().positive(),
    maxPrice: z.number().positive(),
    currency: z.enum(CURRENCY),
    unit: z.enum(WEIGHT_UNIT),
    from: z.date().nullable()
})

export const CargoSchema = z.object({
    category: z.enum(CATEGORIES),
    description: z.string(),
    quantity: z.number(),
    unit: z.enum(WEIGHT_UNIT),
    packing: z.enum(PACKING),
    isHazardous: z.boolean(),
    hazchemCode: z.string().optional(),
    isRefrigerated: z.boolean(),
    temperature: z.number(),
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

    share: z.enum(SHARE),
    price: z.number().optional(),
    currency: z.enum(CURRENCY),
})
    .superRefine((data, ctx) => {
        // If share is "subscribers", price and currency MUST exist
        if (data.share === "subscribers") {
            if (!data.price || data.price <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message: "Price required",
                    path: ["price"]
                });
            }
            if (!data.currency) {
                ctx.addIssue({
                    code: "custom",
                    message: "Currency required",
                    path: ["currency"]
                });
            }
        }
    })

export const TripsTableSchema = z.object({
    order: OrderSchema,
    cargo: CargoSchema,
    trip: TripSchema
})

export const RegisterDriverSchema = z.object({
    name: z.string(),
    email: z.email(),
    country: z.string().nonempty(),
    phoneNumber: z.string().min(9).max(15),
    driverLicense: urlSchema.min(1).max(2),
    passportCard: urlSchema.length(1).optional(),
})

export const RegisterTruckSchema = z.object({
    internalId: z.string(),
    driver: z.string().optional(),
    regPlate: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    type: z.enum(TRUCK_TYPE),
    loadingBay: loadingBaySchema.optional(),
    vin: z.string(),
    booklet: urlSchema,
    license: urlSchema,
})

export const RegisterTrailerSchema = z.object({
    internalId: z.string(),
    regPlate: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    loadingBay: loadingBaySchema,
    vin: z.string(),
    booklet: urlSchema,
    license: urlSchema,
})

export const RegisterLinkSchema = z.object({
    internalId: z.string(),
    regPlate: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    loadingBay: loadingBaySchema,
    vin: z.string(),
    booklet: urlSchema,
    license: urlSchema,
})

export type Urls = z.infer<typeof urlSchema>
export type Location = z.infer<typeof LocationSchema>
export type StatusSchema = z.infer<typeof statusSchema>
export type LoadingBay = z.infer<typeof loadingBaySchema>
export type MarketResponse = z.infer<typeof MarketResponse>
export type CreateOrderForm = z.infer<typeof CreateOrderSchema>
export type RegisterDriverForm = z.infer<typeof RegisterDriverSchema>