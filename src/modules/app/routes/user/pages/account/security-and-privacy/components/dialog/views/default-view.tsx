"use client"

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { PasswordInput } from "@/components/customs/password";

import { TwoFactorForm } from "../../../schemas/two-factor";

interface Props {
    isEnabled: boolean
}

export function DefaultView({ isEnabled }: Props) {
    const t = useTranslations("User.account.security-and-privacy.security.two-factor.dialog.form.default-view")

    const { control, formState: { isSubmitting } } = useFormContext<TwoFactorForm>()

    return (
        <FieldGroup>
            <PasswordInput
                control={control}
                name="password"
                label={t("password.label")}
                placeholder={t("password.placeholder")}
                description={t("password.description")}
                isPending={isSubmitting}
            />

            <Button
                type="submit"
                disabled={isSubmitting}
                variant={isEnabled ? "destructive" : "default"}
            >
                {t(`actions.${isEnabled}`)}
            </Button>
        </FieldGroup>
    )
}
