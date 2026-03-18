import { z } from "zod";
import { CATEGORIES, WEIGHT_UNIT } from "@/backend/db/types";

export function Schema(t: (key: string) => string) {
    return (
        z.object({
            loading: z.array(z.object({
                address: z.string({ error: t("form.loading.error") }).nonempty({ error: t("form.loading.error") }),
                placeId: z.string().nonempty(),
                country: z.string().nonempty(),
                state: z.string().nonempty()
            })),
            offloading: z.array(z.object({
                address: z.string({ error: t("form.offloading.error") }).nonempty({ error: t("form.loading.error") }),
                placeId: z.string().nonempty(),
                country: z.string().nonempty(),
                state: z.string().nonempty()
            })),
            category: z.enum(CATEGORIES, { error: t("form.category.error")}),
            quantity: z.string().optional(),
            unit: z.enum(WEIGHT_UNIT).optional()
        })
    )
}

export const MarkedDataSchema = Schema((k) => k)