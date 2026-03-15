import { z } from "zod";
import { LOADING_BAY, TRUCK_TYPE } from "@/backend/db/types";

// 1. Factory functions
export function createLoadingBay(t: (key: string) => string) {
    return z.object({
        width: z.number({ error: t("form.loading-bay.width.error") }).positive({ error: t("form.loading-bay.width.error") }),
        length: z.number({ error: t("form.loading-bay.length.error") }).positive({ error: t("form.loading-bay.length.error") }),
        height: z.number({ error: t("form.loading-bay.height.error") }).positive({ error: t("form.loading-bay.height.error") }),
        volume: z.number({ error: t("form.loading-bay.volume.error") }).positive({ error: t("form.loading-bay.volume.error") }),
        capacity: z.number({ error: t("form.loading-bay.capacity.error") }).positive({ error: t("form.loading-bay.capacity.error") }),
        type: z.enum(LOADING_BAY, { error: t("form.loading-bay.type.error") })
    })
}

export function createTruckSchema(t: (key: string) => string) {
    const fields = z.object({
        internalId: z.string().optional(),
        regPlate: z.string({ error: t("form.truck.plate-number.error") }).nonempty({ error: t("form.truck.plate-number.error") }),
        brand: z.string({ error: t("form.truck.brand.error") }).nonempty({ error: t("form.truck.brand.error") }),
        model: z.string({ error: t("form.truck.model.error") }).nonempty({ error: t("form.truck.model.error") }),
        year: z.coerce.number({ error: t("form.truck.year.error") }),
        vin: z.string({ error: t("form.truck.vin.error.empty") }).nonempty({ error: t("form.truck.vin.error.empty") }).length(17, { error: t("form.truck.vin.error.invalid") }),
        type: z.enum(TRUCK_TYPE),
        booklet: z.array(z.object({ url: z.url({ error: t("form.truck.license.error.empty") }) })).min(1, { error: t("form.truck.license.error.invalid") }),
        license: z.array(z.object({ url: z.url({ error: t("form.truck.booklet.error.empty") }) })).min(1, { error: t("form.truck.booklet.error.invalid") }),
    })

    return z.discriminatedUnion("type", [
        fields.extend({ type: z.literal("non-articulated"), loadingBay: createLoadingBay(t) }),
        fields.extend({
            type: z.literal("articulated"),
            loadingBay: createLoadingBay(t).partial().optional()
        }),
    ]);
}

export function createTrailerSchema(t: (key: string) => string) {
    return z.object({
        internalId: z.string().optional(),
        regPlate: z.string({ error: t("form.trailer.plate-number.error") }).nonempty({ error: t("form.trailer.plate-number.error") }),
        brand: z.string({ error: t("form.trailer.brand.error") }).nonempty({ error: t("form.trailer.brand.error") }),
        model: z.string({ error: t("form.trailer.model.error") }).nonempty({ error: t("form.trailer.model.error") }),
        year: z.coerce.number({ error: t("form.trailer.year.error") }),
        loadingBay: createLoadingBay(t),
        vin: z.string({ error: t("form.trailer.vin.error.empty") }).nonempty({ error: t("form.trailer.vin.error.empty") }).length(17, { error: t("form.trailer.vin.error.invalid") }),
        booklet: z.array(z.object({ url: z.url({ error: t("form.trailer.license.error.empty") }) })).min(1, { error: t("form.trailer.license.error.invalid") }),
        license: z.array(z.object({ url: z.url({ error: t("form.trailer.booklet.error.empty") }) })).min(1, { error: t("form.trailer.booklet.error.invalid") }),
    })
}

// 2. Static exports for tRPC
export const TruckSchema = createTruckSchema((k) => k);
export const TrailerSchema = createTrailerSchema((k) => k);

// 3. Dynamic Schema for the Form
export function DynamicFleetSchema(hasTrailer: boolean, hasLink: boolean, t: (key: string) => string) {
    const truckSchema = createTruckSchema(t);
    const trailerSchema = createTrailerSchema(t);
    const [NonArticulated, Articulated] = truckSchema.options;

    const NonArticulatedVariant = z.object({
        truck: NonArticulated,
        trailer: z.undefined().optional(),
        link: z.undefined().optional(),
    });

    const ArticulatedVariant = z.object({
        truck: Articulated,
        trailer: trailerSchema,
        link: hasLink ? trailerSchema : z.undefined().optional(),
    });

    return hasTrailer ? z.union([NonArticulatedVariant, ArticulatedVariant]) : NonArticulatedVariant;
}