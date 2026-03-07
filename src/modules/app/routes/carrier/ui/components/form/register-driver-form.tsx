import { useRef } from "react";
import { useTranslations } from "next-intl"
import { IconCirclePlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { RegisterDriverForm as RDF } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/customs/file";
import { TextInput } from "@/components/customs/text";
import { PhoneInput } from "@/components/customs/phone";
import { EmailInput } from "@/components/customs/email";
import { FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

export function RegisterDriverForm() {
    const t = useTranslations("Carrier.company.drivers.dialog.form")

    const { control, setValue, watch, formState: { isSubmitting } } = useFormContext<RDF>()

    const licenseRef = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null)
    ]
    const { fields: licenses, append, remove } = useFieldArray({
        control,
        name: "driverLicense",
        rules: {
            minLength: 1,
            maxLength: 2,
            required: true
        }
    })

    const passportRef = [
        useRef<HTMLInputElement | null>(null)
    ]
    const { fields: passport } = useFieldArray({
        control,
        name: "passportCard",
        rules: {
            maxLength: 1,
            required: false
        }
    })

    function changeCountry(country: string) {
        setValue("country", country)
    }

    const addField = () => append({ url: "" })
    const removeField = (index: number) => remove(index)

    return (
        <FieldGroup className="max-h-3/5 overflow-y-scroll container-snap p-6">
            <TextInput
                control={control}
                name="name"
                label={t("name.label")}
                isPending={isSubmitting}
                placeholder={t("name.placeholder")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmailInput
                    control={control}
                    name="email"
                    label={t("email.label")}
                    isPending={isSubmitting}
                    placeholder={t("email.placeholder")}
                />

                <PhoneInput
                    control={control}
                    name="phoneNumber"
                    isPending={isSubmitting}
                    country={watch().country}
                    setCountry={changeCountry}
                    label={t("phone-number.label")}
                />
            </div>

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("driver-license.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("driver-license.description")}</FieldDescription>
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={addField}
                        disabled={licenses.length == 2}
                    >
                        {t("driver-license.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {licenses.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        isPending={isSubmitting}
                        inputRef={licenseRef[index]}
                        name={`driverLicense.${index}.url`}
                        placeholder={index === 0 ? t("driver-license.placeholder.front") : t("driver-license.placeholder.back")}

                        owner={watch().name}
                        path={"driver-license"}

                        index={index}
                        remove={removeField}
                        length={licenses.length}
                    />
                ))}
            </FieldSet>

            <FieldSet className="flex flex-col gap-1">
                <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                    <FieldLabel>{t("passport-card.label")}</FieldLabel>
                    <FieldDescription className="text-xs">{t("passport-card.description")}</FieldDescription>
                </FieldLegend>

                {passport.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        isPending={isSubmitting}
                        inputRef={passportRef[index]}
                        name={`passportCard.${index}.url`}
                        placeholder={t("passport-card.placeholder")}

                        owner={watch().name}
                        
                        path={"passport-card"}
                        index={index}
                        remove={removeField}
                        length={passport.length}
                    />
                ))}
            </FieldSet>
        </FieldGroup>
    )
}
