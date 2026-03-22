import { z } from "zod"

export function TwoFactorPassword(t: (key: string) => string) {
    return z.object({
        password: z.string({ error: t("form.default-view.password.error") }).nonempty({ error: t("form.default-view.password.error") })
    })
}

export function TwoFactorCode(t: (key: string) => string) {
    return z.object({
        code: z.string({ error: t("code.error.empty") }).regex(/^\d{6}$/, { error: t("code.error.invalid") })
    })
}

export type TwoFactorForm = z.infer<ReturnType<typeof TwoFactorPassword>>