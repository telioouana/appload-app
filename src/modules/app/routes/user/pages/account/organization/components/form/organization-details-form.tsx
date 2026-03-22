"use client"

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form"

import { TextInput } from "@/components/customs/text";
import { EmailInput } from "@/components/customs/email";
import { PhoneInput } from "@/components/customs/phone";
import { NumberInput } from "@/components/customs/number";
import { LocationInput } from "@/components/customs/location";
import { FieldDescription, FieldGroup, FieldLegend, FieldTitle } from "@/components/ui/field";

import { CreateOrganizationForm } from "../../schemas/organization";

export function OrganizationDetailsForm() {
    const t = useTranslations("User.account.organization.form.register.info")

    const { control, formState: { isSubmitting }, setValue, watch } = useFormContext<CreateOrganizationForm>()

    return (
        <FieldGroup>
            <FieldLegend className="mb-0">
                <FieldTitle>{t("title")}</FieldTitle>
                <FieldDescription>{t("description")}</FieldDescription>
            </FieldLegend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                    control={control}
                    name="info.name"
                    label={t("name.label")}
                    placeholder={t("name.placeholder")}
                    isPending={isSubmitting}
                />

                <NumberInput
                    control={control}
                    name="info.nuit"
                    label={t("nuit.label")}
                    placeholder={t("nuit.placeholder")}
                    isPending={isSubmitting}

                    isNumber={false}
                    length={9}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    country={watch("info.country")}
                    setCountry={(country) => setValue("info.country", country)}
                    isPending={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                    <LocationInput
                        control={control}
                        name="info.billingAddress.address"
                        label={t("billing-address.label")}
                        placeholder={t("billing-address.placeholder")}
                        isPending={isSubmitting}

                        setPlaceId={(value) => setValue("info.billingAddress.placeId", value)}
                        setCountry={(value) => setValue("info.billingAddress.country", value)}
                        setState={(value) => setValue("info.billingAddress.state", value)}
                    />
                </div>

                <div className="w-full">
                    <LocationInput
                        control={control}
                        name="info.physicalAddress.address"
                        label={t("physical-address.label")}
                        placeholder={t("physical-address.placeholder")}
                        isPending={isSubmitting}

                        setPlaceId={(value) => setValue("info.physicalAddress.placeId", value)}
                        setCountry={(value) => setValue("info.physicalAddress.country", value)}
                        setState={(value) => setValue("info.physicalAddress.state", value)}
                    />
                </div>
            </div>
        </FieldGroup>
    )
}
