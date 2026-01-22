import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { IconCheck, IconSend } from "@tabler/icons-react"

import { authClient } from "@/backend/auth/auth-client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { OTPInput } from "@/components/customs/otp"
import { FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"

import { countryCodes } from "@/lib/country-codes"
import { SignUpForm, Step } from "@/modules/auth/pages/sign-up/schema/validation"

interface Props {
    callbackURL: string
    changeStep: (step: Step) => void
}

export function OTPVerification({ callbackURL, changeStep }: Props) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Auth.sign-up.form")
    const router = useRouter()

    const { control, clearErrors, getValues, trigger } = useFormContext<SignUpForm>()

    function handleBack() {
        changeStep("update-phone")
    }

    async function handleResend(values: SignUpForm) {
        setPending(true)

        const { error } = await authClient.phoneNumber.sendOtp({
            phoneNumber: `${countryCodes.find(({ country }) => country === values.step2.country)?.code}${values.step2.phoneNumber}`
        })

        if (error) {
            if (error.message) toast.error(t(`errors.${error.message}`))
            else toast.error(t("errors.OTHER"))

            setPending(false)
            return
        }
        toast.success(t("step4.code.SUCCESS"))
        setPending(false)
    }

    async function handleVerify(values: SignUpForm) {
        clearErrors()

        const output = await trigger(["step4.code"], { shouldFocus: true })
        if (!output) return

        setPending(true)
        const { error } = await authClient.phoneNumber.verify({
            phoneNumber: `${countryCodes.find(({ country }) => country === values.step2.country)?.code}${values.step2.phoneNumber}`,
            code: values.step4.code,
            disableSession: true
        })

        if (error) {
            const { status } = error
            let message: string

            if (status === 429) message = "MAX_VERIFY_OTP_REACHED"
            else if (status === 410) message = "VERIFY_OTP_CANCELED"
            else if (status === 408) message = "VERIFY_OTP_EXPIRED"
            else if (status === 404) message = "VERIFY_OTP_DELETED"
            else if (status === 401) message = "VERIFY_OTP_INVALID"
            else if (status === 400) message = "VERIFY_OTP_FAILED"
            else message = "OTHER"

            toast.error(t(`errors.${message}`))

            setPending(false)
            return
        }

        await authClient.signIn.email({
            email: values.step2.email,
            password: values.step3.password,
            callbackURL
        }, {
            onSuccess: () => {
                router.push(callbackURL)
                setPending(false)
            },
            onError: (error) => {
                console.log("Sign-in error: ", error)
                // TODO: Create proper message on translation file
                toast.error(t("errors.SIGN_IN_FAILED"))
                setPending(false)
            }
        })
    }

    return (
        <FieldGroup>
            <FieldContent>
                <FieldTitle className="w-full justify-center text-md font-semibold">{t("step4.title")}</FieldTitle>
                <FieldDescription>{t("step4.description")}</FieldDescription>
            </FieldContent>
            <div className="w-full flex flex-col gap-2.5">
                <OTPInput
                    control={control}
                    name="step4.code"
                    label={t("step4.code.label")}
                />

                <FieldDescription className="space-x-2 text-xs leading-0.5">
                    <span className="text-justify">{t("step4.button.edit.text", { phoneNumber: `${countryCodes.find(({ country }) => country === getValues().step2.country)?.code}${getValues().step2.phoneNumber}` })}</span>
                    <Button
                        type="button"
                        variant="link"
                        disabled={isPending}
                        onClick={handleBack}
                        className="p-0 text-xs"
                    >
                        {t("step4.button.edit.action")}
                    </Button>
                </FieldDescription>
            </div>

            <Button
                type="button"
                variant="secondary"
                onClick={() => handleResend(getValues())}
                disabled={isPending}
            >
                {t("step4.button.resend")}
                {isPending ? <Spinner /> : <IconSend />}
            </Button>

            <Button
                type="button"
                onClick={() => handleVerify(getValues())}
                disabled={isPending}
            >
                {t("step4.button.verify")}
                {isPending ? <Spinner /> : <IconCheck />}
            </Button>
        </FieldGroup>
    )
}