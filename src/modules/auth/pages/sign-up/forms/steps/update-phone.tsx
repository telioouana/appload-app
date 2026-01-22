import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { IconCheck } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"

import { authClient } from "@/backend/auth/auth-client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { PhoneInput } from "@/components/customs/phone"
import { FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"

import { countryCodes } from "@/lib/country-codes"
import { SignUpForm, Step } from "@/modules/auth/pages/sign-up/schema/validation"
import { updatePhoneNumber } from "@/modules/auth/pages/sign-up/server/procedures"

interface Props {
    changeStep: (step: Step) => void
}

export function UpdatePhone({ changeStep }: Props) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Auth.sign-up.form")
    const { control, clearErrors, getValues, setError, setValue, trigger } = useFormContext<SignUpForm>()

    const [initialPhone] = useState(() => {
        const country = getValues().step2.country
        const code = countryCodes.find((c) => c.country === country)?.code ?? ""
        return `${code}${getValues().step2.phoneNumber}`
    })

    function updateCountry(country: string) {
        setValue("step2.country", country)
    }

    async function handleVerify(values: SignUpForm) {
        clearErrors()
        const output = await trigger(["step2.country", "step2.phoneNumber"], { shouldFocus: true })
        if (!output) return

        setPending(true)
        const phoneNumber = `${countryCodes.find(({ country }) => country === values.step2.country)?.code}${values.step2.phoneNumber}`

        if (phoneNumber === initialPhone) {
            setError("step2.phoneNumber", { message: t("errors.NO_CHANGES_DETECTED") }, { shouldFocus: true })
            setPending(false)
            return
        }

        let phoneCheck
        try {
            phoneCheck = await updatePhoneNumber(initialPhone, phoneNumber)
        } catch {
            toast.error(t("errors.OTHER"))
            setPending(false)
            return
        }

        if (phoneCheck) {
            setError("step2.phoneNumber", { message: t("errors.CONFLICT_PHONE") }, { shouldFocus: true })
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
                <FieldTitle className="w-full justify-center text-md font-semibold">{t("step4.title")}</FieldTitle>
                <FieldDescription>{t("step4.description")}</FieldDescription>
            </FieldContent>

            <PhoneInput
                control={control}
                name="step2.phoneNumber"
                label={t("step2.phone-number.label")}
                country={getValues().step2.country}
                setCountry={updateCountry}
                isPending={isPending}
            />

            <Button
                type="button"
                onClick={() => handleVerify(getValues())}
                disabled={isPending}
            >
                {t("step2.button.next")}
                {isPending ? <Spinner /> : <IconCheck />}
            </Button>
        </FieldGroup>
    )
}