import { useRef } from "react";
import { useTranslations } from "next-intl"
import { IconCirclePlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { TRUCK_TYPE, YEARS } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { FileInput } from "@/components/customs/file";
import { TextInput } from "@/components/customs/text";
import { Separator } from "@/components/ui/separator";
import { SelectInput } from "@/components/customs/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle, } from "@/components/ui/field";

import { LoadingBayForm } from "./loading-bay-form";

interface Props {
    setHasTrailer: (hasTrailer: boolean) => void
}

export function RegisterTruckForm({ setHasTrailer }: Props) {
    const t = useTranslations("Carrier.company.fleet.dialog.form.truck")

    const { control, setValue, watch, formState: { isSubmitting } } = useFormContext()

    const licenseRef = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null)
    ]
    const { fields: licenses, append: addLicense, remove: removeLicense } = useFieldArray({
        control,
        name: "truck.license",
        rules: {
            minLength: 1,
            required: true
        }
    })

    const bookletRef = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null)
    ]
    const { fields: booklets, append: addBooklet, remove: removeBooklet } = useFieldArray({
        control,
        name: "truck.booklet",
        rules: {
            minLength: 1,
            required: true
        }
    })

    const addField = (path: string) =>
        path === "truck-license"
            ? addLicense({ url: "" })
            : addBooklet({ url: "" })

    const removeField = (index: number, path?: string) =>
        path === "truck-license"
            ? removeLicense(index)
            : removeBooklet(index)


    return (
        <FieldGroup>
            <FieldSet className="flex flex-col">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <FieldLabel>{t("label")}</FieldLabel>
                    <Separator />
                </FieldLegend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        control={control}
                        name="truck.regPlate"
                        isPending={isSubmitting}
                        label={t("plate-number.label")}
                        placeholder={t("plate-number.placeholder")}

                        hasInputMask
                        inputMask={'AAA 999 AA'}
                    />

                    <TextInput
                        control={control}
                        name="truck.internalId"
                        isPending={isSubmitting}
                        label={t("internal-id.label")}
                        placeholder={t("internal-id.placeholder")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        control={control}
                        name="truck.brand"
                        isPending={isSubmitting}
                        label={t("brand.label")}
                        placeholder={t("brand.placeholder")}
                    />

                    <TextInput
                        control={control}
                        name="truck.model"
                        isPending={isSubmitting}
                        label={t("model.label")}
                        placeholder={t("model.placeholder")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                        control={control}
                        name="truck.year"
                        isPending={isSubmitting}
                        label={t("year.label")}
                        placeholder={t("year.placeholder")}
                    >
                        {YEARS.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                    </SelectInput>

                    <TextInput
                        control={control}
                        name="truck.vin"
                        isPending={isSubmitting}
                        label={t("vin.label")}
                        placeholder={t("vin.placeholder")}
                    />
                </div>
            </FieldSet>

            <FieldSet>
                <FieldLegend variant="label">{t("type.label")}</FieldLegend>
                <FieldDescription>{t("type.description")}</FieldDescription>

                <RadioGroup
                    defaultValue={watch("truck.type")}
                    className="flex gap-4"
                    onValueChange={(value: typeof TRUCK_TYPE[number]) => {
                        setValue("truck.type", value)
                        if (value === TRUCK_TYPE[0]) setHasTrailer(true)
                        else setHasTrailer(false)

                    }}
                >
                    <FieldLabel htmlFor="articulated-r2h">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>{t("type.articulated.label")}</FieldTitle>
                                <FieldDescription>{t("type.articulated.description")}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={TRUCK_TYPE[0]} id="articulated-r2h" />
                        </Field>
                    </FieldLabel>

                    <FieldLabel htmlFor="non-articulated-z4k">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>{t("type.non-articulated.label")}</FieldTitle>
                                <FieldDescription>{t("type.non-articulated.description")}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={TRUCK_TYPE[1]} id="non-articulated-z4k" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>
            </FieldSet>

            {watch().truck.type === TRUCK_TYPE[1] && (
            <LoadingBayForm name="truck" />
            )}

            <Separator />

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("license.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("license.description")}</FieldDescription>
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addField("truck-license")}
                        disabled={licenses.length == 2}
                    >
                        {t("license.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {licenses.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        isPending={isSubmitting}
                        inputRef={licenseRef[index]}
                        name={`truck.license.${index}.url`}
                        placeholder={index === 0 ? t("license.placeholder.front") : t("license.placeholder.back")}

                        owner={watch().truck.regPlate}
                        path={"truck-license"}

                        index={index}
                        remove={removeField}
                        length={licenses.length}
                    />
                ))}
            </FieldSet>

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("booklet.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("booklet.description")}</FieldDescription>
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addField("truck-booklet")}
                        disabled={booklets.length == 2}
                    >
                        {t("booklet.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {booklets.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        isPending={isSubmitting}
                        inputRef={bookletRef[index]}
                        name={`truck.booklet.${index}.url`}
                        placeholder={index === 0 ? t("booklet.placeholder.front") : t("booklet.placeholder.back")}

                        owner={watch().truck.regPlate}
                        path={"truck-booklet"}

                        index={index}
                        remove={removeField}
                        length={booklets.length}
                    />
                ))}
            </FieldSet>
        </FieldGroup>
    )
}