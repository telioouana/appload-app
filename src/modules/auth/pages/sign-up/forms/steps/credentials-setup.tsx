import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { IconCheck, IconChevronLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { PasswordInput } from "@/components/customs/password"
import { FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"

import { countryCodes } from "@/lib/country-codes"
import { authClient } from "@/backend/auth/auth-client"
import { SignUpForm, Step } from "@/modules/auth/pages/sign-up/schema/validation"

interface Props {
    changeStep: (step: Step) => void
}

export function CredentialsSetup({ changeStep }: Props) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Auth.sign-up.form")
    const { control, clearErrors, getValues, trigger } = useFormContext<SignUpForm>()

    function handleBack() {
        changeStep("personal-details")
    }

    async function handleVerify(values: SignUpForm) {
        clearErrors()
        const output = await trigger(["step2.country"], { shouldFocus: true })
        if (!output) return

        setPending(true)
        const phoneNumber = `${countryCodes.find(({ country }) => country === values.step2.country)?.code}${values.step2.phoneNumber}`

        const result = await authClient.signUp.email({
            email: values.step2.email,
            password: values.step3.password,
            name: values.step2.name,
            type: values.step1.type,
            phoneNumber: phoneNumber,
            gender: values.step2.gender,
        }, {
            
        })

        if (result.error) {
            const { error } = result
            if (error.message) toast.error(t(`errors.${error.message}`))
            else toast.error(t("errors.OTHER"))
            setPending(false)
            return
        }

        const { error } = await authClient.phoneNumber.sendOtp({
            phoneNumber
        })

        if (error) {
            if (error.message) toast.error(t(`errors.${error.message}`))
            else toast.error(t("errors.OTHER"))
            setPending(false)
            return
        }

        changeStep("otp-verification")
        setPending(false)
        return
    }

    return (
        <FieldGroup>
            <FieldContent>
                <FieldTitle className="w-full justify-center text-md font-semibold">{t("step3.title")}</FieldTitle>
                <FieldDescription>{t("step3.description")}</FieldDescription>
            </FieldContent>

            <PasswordInput
                control={control}
                name="step3.password"
                label={t("step3.password.label")}
                placeholder={t("step3.password.placeholder")}
                isPending={isPending}
            />
            <PasswordInput
                control={control}
                name="step3.confirm"
                label={t("step3.confirm.label")}
                placeholder={t("step3.confirm.placeholder")}
                isPending={isPending}
            />


            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={handleBack}
                >
                    <IconChevronLeft />
                    {t("step3.button.back")}
                </Button>
                <Button
                    type="button"
                    onClick={() => handleVerify(getValues())}
                    disabled={isPending}
                >
                    {t("step3.button.sign-up")}
                    {isPending ? <Spinner /> : <IconCheck />}
                </Button>
            </div>
        </FieldGroup>
    )
}