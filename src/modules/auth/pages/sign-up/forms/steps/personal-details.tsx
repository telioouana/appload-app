import { toast } from "sonner"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SelectItem } from "@/components/ui/select"
import { TextInput } from "@/components/customs/text"
import { EmailInput } from "@/components/customs/email"
import { PhoneInput } from "@/components/customs/phone"
import { SelectInput } from "@/components/customs/select"
import { FieldContent, FieldDescription, FieldGroup, FieldTitle } from "@/components/ui/field"

import { countryCodes } from "@/lib/country-codes"
import { checkUser } from "@/modules/auth/pages/sign-up/server/procedures"
import { GENDER, SignUpForm, Step } from "@/modules/auth/pages/sign-up/schema/validation"

interface Props {
    changeStep: (step: Step) => void
}

export function PersonalDetails({ changeStep }: Props) {
    const [isPending, setPending] = useState<boolean>(false)

    const t = useTranslations("Auth.sign-up.form")
    const { control, clearErrors, getValues, setError, setValue, trigger, watch } = useFormContext<SignUpForm>()

    function updateCountry(country: string) {
        setValue("step2.country", country)
    }

    function handleBack() {
        changeStep("account-type")
    }

    async function handleVerify(values: SignUpForm) {
        clearErrors()
        const output = await trigger(["step2.gender", "step2.name", "step2.email", "step2.country", "step2.phoneNumber"], { shouldFocus: true })
        if (!output) return

        setPending(true)
        const phoneNumber = `${countryCodes.find(({ country }) => country === values.step2.country)?.code ?? ""}${values.step2.phoneNumber}`

        const emailCheck = await checkUser(values.step2.email, "email").catch(() => {
            toast.error(t("errors.OTHER"))
            setPending(false)
            return
        })

        if (emailCheck) {
            setError("step2.email", { message: t("errors.CONFLICT_EMAIL") }, { shouldFocus: true })
            setPending(false)
            return
        }

        const phoneCheck = await checkUser(phoneNumber, "phoneNumber").catch(() => {
            toast.error(t("errors.OTHER"))
            setPending(false)
            return
        })

        if (phoneCheck) {
            setError("step2.phoneNumber", { message: t("errors.CONFLICT_PHONE") }, { shouldFocus: true })
            setPending(false)
            return
        }

        changeStep("credentials-setup")
        setPending(false)
        return
    }

    return (
        <FieldGroup>
            <FieldContent>
                <FieldTitle className="w-full justify-center text-md font-semibold">{t("step2.title")}</FieldTitle>
                <FieldDescription>{t("step2.description")}</FieldDescription>
            </FieldContent>

            <SelectInput
                control={control}
                name="step2.gender"
                label={t("step2.gender.label")}
                placeholder={t("step2.gender.placeholder")}
                isPending={isPending}
            >
                {GENDER.map((item) => <SelectItem key={item} value={item}>{t(`step2.gender.options.${item}`)}</SelectItem>)}
            </SelectInput>

            <TextInput
                control={control}
                name="step2.name"
                label={t("step2.name.label")}
                placeholder={t("step2.name.placeholder")}
                isPending={isPending}
            />

            <EmailInput
                control={control}
                name="step2.email"
                label={t("step2.email.label")}
                placeholder={t("step2.email.placeholder")}
                isPending={isPending}
            />

            <PhoneInput
                control={control}
                name="step2.phoneNumber"
                label={t("step2.phone-number.label")}
                country={watch().step2.country}
                setCountry={updateCountry}
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
                    {t("step2.button.back")}
                </Button>
                <Button
                    type="button"
                    onClick={() => handleVerify(getValues())}
                    disabled={isPending}
                >
                    {t("step2.button.next")}
                    {isPending ? <Spinner /> : <IconChevronRight />}
                </Button>
            </div>
        </FieldGroup>
    )
}