"use client"

import { useRef } from "react";
import { useTranslations } from "next-intl"
import { IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { YEARS } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { FileInput } from "@/components/customs/file";
import { TextInput } from "@/components/customs/text";
import { Separator } from "@/components/ui/separator";
import { SelectInput } from "@/components/customs/select";
import { FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

import { LoadingBayForm } from "./loading-bay-form";
import { FullFleetForm } from "../dialog/register-fleet-dialog";

interface Props {
    name: "truck" | "trailer" | "link"
    hasLink?: boolean
    addLink?: () => void
    remove: () => void
}

export function RegisterTrailerForm({ name, hasLink, addLink, remove }: Props) {
    const t = useTranslations("Carrier.company.fleet.dialog.form.trailer")

    const { control, watch, formState: { isSubmitting } } = useFormContext<FullFleetForm>()

    const licenseRef = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null)
    ]
    const { fields: licenses, append: addLicense, remove: removeLicense } = useFieldArray({
        control,
        name: `${name}.license`,
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
        name: `${name}.booklet`,
        rules: {
            minLength: 1,
            required: true
        }
    })

    const addField = (path: string) =>
        path === `${name}-license`
            ? addLicense({ url: "" })
            : addBooklet({ url: "" })

    const removeField = (index: number, path?: string) =>
        path === `${name}-license`
            ? removeLicense(index)
            : removeBooklet(index)


    return (
        <FieldGroup>
            <FieldSet className="flex flex-col">
                <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                    <div className="flex justify-between items-center">
                        <FieldLabel>{t(`label.${name}`)}</FieldLabel>

                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={remove}
                            className="text-destructive"
                        >
                            {t(`buttons.remove.${name}`)}
                        </Button>
                    </div>
                    <Separator />
                </FieldLegend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        control={control}
                        name={`${name}.regPlate`}
                        isPending={isSubmitting}
                        label={t("plate-number.label")}
                        placeholder={t("plate-number.placeholder")}

                        hasInputMask
                        inputMask={'AA 999 AA'}
                    />

                    <TextInput
                        control={control}
                        name={`${name}.internalId`}
                        label={t("internal-id.label")}
                        isPending={isSubmitting}
                        placeholder={t("internal-id.placeholder")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        control={control}
                        name={`${name}.brand`}
                        label={t("brand.label")}
                        isPending={isSubmitting}
                        placeholder={t("brand.placeholder")}
                    />

                    <TextInput
                        control={control}
                        name={`${name}.model`}
                        label={t("model.label")}
                        isPending={isSubmitting}
                        placeholder={t("model.placeholder")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectInput
                        control={control}
                        name={`${name}.year`}
                        label={t("year.label")}
                        isPending={isSubmitting}
                        placeholder={t("year.placeholder")}
                    >
                        {YEARS.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                    </SelectInput>

                    <TextInput
                        control={control}
                        name={`${name}.vin`}
                        isPending={isSubmitting}
                        label={t("vin.label")}
                        placeholder={t("vin.placeholder")}
                        hasPattern
                        // Alphanumeric, exactly 17, excludes I, O, Q
                        pattern="^[A-HJ-NPR-Z0-9]{17}$" 
                        regex={/[^a-zA-Z0-9]/g}
                        length={17}
                    />
                </div>
            </FieldSet>

            <LoadingBayForm name={name} />

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
                        onClick={() => addField(`${name}-license`)}
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
                        name={`${name}.license.${index}.url`}
                        placeholder={index === 0 ? t("license.placeholder.front") : t("license.placeholder.back")}

                        owner={`${watch(`${name}.regPlate`)}`}
                        path={`${name}-license`}

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
                        onClick={() => addField(`${name}-booklet`)}
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
                        name={`${name}.booklet.${index}.url`}
                        placeholder={index === 0 ? t("booklet.placeholder.front") : t("booklet.placeholder.back")}

                        owner={`${watch(`${name}.regPlate`)}`}
                        path={`${name}-booklet`}

                        index={index}
                        remove={removeField}
                        length={booklets.length}
                    />
                ))}
            </FieldSet>

            {name === "trailer" && !hasLink && (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-2 py-6 text-primary"
                    onClick={addLink}
                >
                    <IconPlus />
                    {t("buttons.add")}
                </Button>
            )}
        </FieldGroup>
    )
}