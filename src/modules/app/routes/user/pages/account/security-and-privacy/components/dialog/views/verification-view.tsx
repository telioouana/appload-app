"use client"

import QRCode from "react-qr-code"

import { z } from "zod"
import { toast } from "sonner"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"

import { authClient } from "@/backend/auth/auth-client"

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { NumberInput } from "@/components/customs/number";

import { TFA, TwoFactorData } from "../../../types/types"
import { TwoFactorCode } from "../../../schemas/two-factor"

interface Props {
    tfd: TwoFactorData
    setView: (view: TFA) => void
}

export function VerificationView({ tfd, setView }: Props) {
    const t = useTranslations("User.account.security-and-privacy.security.two-factor.dialog.form.verification-view")

    const TwoFactorSchema = useMemo(() => TwoFactorCode(t), [t])
    type TwoFactorForm = z.infer<typeof TwoFactorSchema>

    const form = useForm<TwoFactorForm>({
        resolver: zodResolver(TwoFactorSchema)
    })

    async function handleVerify(values: TwoFactorForm) {
        await authClient.twoFactor.verifyTotp({
            code: values.code.toString()
        }, {
            onSuccess: () => {
                setView("backup-codes")
            },
            onError: ({error}) => {
                // TODO: Internationalization
                toast.error(error.message || "Failed to verify code")
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(handleVerify)}>
            <FieldGroup>
                <NumberInput
                    control={form.control}
                    name="code"
                    label={t("code.label")}
                    description={t("code.description")}
                    isPending={form.formState.isSubmitting}
                    length={6}
                    isNumber={false}
                />

                <div className="flex justify-center items-center p-4 bg-white w-full">
                    <QRCode size={196} value={tfd.totpURI} />
                </div>

                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    {t(`actions.verify`)}
                </Button>
            </FieldGroup>
        </form>
    )
}
