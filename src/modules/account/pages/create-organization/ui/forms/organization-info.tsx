import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form"
import { IconChevronRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TextInput } from "@/components/customs/text";
import { EmailInput } from "@/components/customs/email";
import { PhoneInput } from "@/components/customs/phone";
import { NumberInput } from "@/components/customs/number";
import { FieldDescription, FieldGroup, FieldLegend, FieldTitle } from "@/components/ui/field";

import { checkNuit } from "@/modules/account/pages/create-organization/server/procedures";
import { CreateOrganizationForm, View } from "@/modules/account/pages/create-organization/ui/schema/validation";

type Props = {
    changeView: (view: View) => void
}

export function OrganizationInfo({ changeView }: Props) {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const t = useTranslations("Account.organization.create.form.info")

    const { clearErrors, control, getValues, setError, setValue, trigger, watch } = useFormContext<CreateOrganizationForm>()

    function updateCountry(country: string) {
        setValue("info.country", country)
    }

    async function handleNext(values: CreateOrganizationForm) {
        clearErrors()

        const output = await trigger(["info.name", "info.nuit", "info.email", "info.phoneNumber", "info.billingAddress", "info.physicalAddress"], { shouldFocus: true })
        if (!output) return

        setSubmitting(true)

        await checkNuit(values.info.nuit)
            .then(() => {
                setSubmitting(false)
                changeView("kyc-info")
            })
            .catch(() => {
                setSubmitting(false)
                setError("info.nuit", { message: t("nuit.error.conflict") }, { shouldFocus: true })
                return
            })
    }

    return (
        <FieldGroup>
            <FieldLegend className="mb-0">
                <FieldTitle>{t("title")}</FieldTitle>
                <FieldDescription>{t("description")}</FieldDescription>
            </FieldLegend>

            <TextInput
                control={control}
                name="info.name"
                label={t("name.label")}
                placeholder={t("name.placeholder")}
                isPending={isSubmitting}
            />

            <div className="flex gap-4 items-center justify-between">
                <NumberInput
                    control={control}
                    name="info.nuit"
                    label={t("nuit.label")}
                    placeholder={t("nuit.placeholder")}
                    isPending={isSubmitting}
                />

                <EmailInput
                    control={control}
                    name="info.email"
                    label={t("email.label")}
                    placeholder={t("email.placeholder")}
                    isPending={isSubmitting}
                />

                <PhoneInput
                    control={control}
                    name="info.phoneNumber"
                    label={t("phone-number.label")}
                    country={watch().info.country}
                    setCountry={updateCountry}
                    isPending={isSubmitting}
                />
            </div>

            <div className="flex gap-4 items-center justify-between">
                <div className="w-full">
                    <TextInput
                        control={control}
                        name="info.billingAddress"
                        label={t("billing-address.label")}
                        placeholder={t("billing-address.placeholder")}
                        isPending={isSubmitting}
                    />
                </div>

                <div className="w-full">
                    <TextInput
                        control={control}
                        name="info.physicalAddress"
                        label={t("physical-address.label")}
                        placeholder={t("physical-address.placeholder")}
                        isPending={isSubmitting}
                    />
                </div>
            </div>

            <div className="flex w-full gap-4 justify-end items-center mt-4">
                <div className="w-full" />

                <div className="w-full flex justify-end gap-4">
                    <div className="w-full" />

                    <div className="w-full">
                        <Button
                            type="button"
                            className="w-full"
                            disabled={isSubmitting}
                            onClick={() => handleNext(getValues())}
                        >
                            {t("button.next")}
                            {isSubmitting ? <Spinner /> : <IconChevronRight />}
                        </Button>
                    </div>
                </div>
            </div>
        </FieldGroup>
    )
}
