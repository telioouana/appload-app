"use client"

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { IconCirclePlus } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FISCAL_REGIME } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { FileInput } from "@/components/customs/file";
import { SelectInput } from "@/components/customs/select";
import { FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";

import { CreateOrganizationForm } from "../../schemas/organization";

export function KYCDetailsForm() {
    const t = useTranslations("User.account.organization.form.register.kyc")

    const { control, formState: { errors, isSubmitting }, getValues, watch } = useFormContext<CreateOrganizationForm>()

    const idRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: ids, append: addId, remove: removeId } = useFieldArray({
            control,
            name: "kyc.idCard",
            rules: {
                minLength: 1,
                maxLength: 2,
                required: true
            }
        })
    
        const nuitRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: nuits, append: addNuit, remove: removeNuit } = useFieldArray({
            control,
            name: "kyc.nuit",
            rules: {
                minLength: 1,
                maxLength: 2,
                required: true
            }
        })
    
        const alvaraRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: alvaras, append: addAlvara, remove: removeAlvara } = useFieldArray({
            control,
            name: "kyc.alvara",
            rules: {
                maxLength: 5
            }
        })
    
        const bankLetterRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: bankLetters, append: addBankLetter, remove: removeBankLetter } = useFieldArray({
            control,
            name: "kyc.bankLetter",
            rules: {
                maxLength: 2,
            }
        })
    
        const republicBulletinRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: republicBulletins, append: addRepublicBulletin, remove: removeRepublicBulletin } = useFieldArray({
            control,
            name: "kyc.republicBulletin",
            rules: {
                maxLength: 2,
            }
        })
    
        const commercialExerciseRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: commercialExercises, append: addCommercialExercise, remove: removeCommercialExercise } = useFieldArray({
            control,
            name: "kyc.commercialExercise",
            rules: {
                maxLength: 2,
            }
        })
    
        const commercialCertificateRef = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null)
        ]
        const { fields: commercialCertificates, append: addCommercialCertificate, remove: removeCommercialCertificate } = useFieldArray({
            control,
            name: "kyc.commercialCertificate",
            rules: {
                maxLength: 5,
            }
        })
    
        const addField = (path: string) =>
            path === "id" ? addId({ url: "" }) :
                path === "nuit" ? addNuit({ url: "" }) :
                    path === "alvara" ? addAlvara({ url: "" }) :
                        path === "bankLetter" ? addBankLetter({ url: "" }) :
                            path === "republicBulletin" ? addRepublicBulletin({ url: "" }) :
                                path === "commercialExercise" ? addCommercialExercise({ url: "" }) :
                                    path === "commercialCertificate" ? addCommercialCertificate({ url: "" }) :
                                        null
    
        const removeField = (index: number, path?: string) =>
            path === "id" ? removeId(index) :
                path === "nuit" ? removeNuit(index) :
                    path === "alvara" ? removeAlvara(index) :
                        path === "bankLetter" ? removeBankLetter(index) :
                            path === "republicBulletin" ? removeRepublicBulletin(index) :
                                path === "commercialExercise" ? removeCommercialExercise(index) :
                                    path === "commercialCertificate" ? removeCommercialCertificate(index) :
                                        null

    return (
        <FieldGroup>
            <FieldContent className="mb-0">
                <FieldTitle>{t("title")}</FieldTitle>
                <FieldDescription>{t("description")}</FieldDescription>
            </FieldContent>

            {getValues().info.type === "carrier" && (
                <SelectInput
                    control={control}
                    name="kyc.fiscalRegime"
                    isPending={isSubmitting}
                    label={t("fiscal-regime.label")}
                    placeholder={t("fiscal-regime.placeholder")}
                >
                    {FISCAL_REGIME.map((item) => <SelectItem key={item} value={item}>{t(`fiscal-regime.options.${item}`)}</SelectItem>)}
                </SelectInput>
            )}

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("id-card.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("id-card.description")}</FieldDescription>
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addField("id")}
                        disabled={ids.length == 2}
                    >
                        {t("button.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {ids.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        inputRef={idRef[index]}
                        isPending={isSubmitting}
                        name={`kyc.idCard.${index}.url`}
                        placeholder={index == 0 ? t("id-card.placeholder") : t("id-card.placeholder-page", { page: index + 1 })}

                        path={"id"}
                        owner={watch().info.name}

                        index={index}
                        length={ids.length}
                        remove={removeField}
                    />
                ))}
            </FieldSet>

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("nuit.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("nuit.description")}</FieldDescription>
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addField("nuit")}
                        disabled={nuits.length == 2}
                    >
                        {t("button.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {nuits.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        inputRef={nuitRef[index]}
                        isPending={isSubmitting}
                        name={`kyc.nuit.${index}.url`}
                        placeholder={index == 0 ? t("nuit.placeholder") : t("nuit.placeholder-page", { page: index + 1 })}

                        path={"nuit"}
                        owner={watch().info.name}

                        index={index}
                        length={nuits.length}
                        remove={removeField}
                    />
                ))}
            </FieldSet>

            <FieldSet className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                    <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                        <FieldLabel>{t("commercial-certificate.label")}</FieldLabel>
                        <FieldDescription className="text-xs">{t("commercial-certificate.description")}</FieldDescription>
                        {errors.kyc?.commercialCertificate?.root && (
                            <FieldError errors={[errors.kyc?.commercialCertificate?.root]} />
                        )}
                    </FieldLegend>

                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addField("commercialCertificate")}
                        disabled={commercialCertificates.length == 5}
                    >
                        {t("button.add-page")}
                        <IconCirclePlus />
                    </Button>
                </div>

                {commercialCertificates.map((field, index) => (
                    <FileInput
                        key={field.id}
                        control={control}
                        inputRef={commercialCertificateRef[index]}
                        isPending={isSubmitting}
                        name={`kyc.commercialCertificate.${index}.url`}
                        placeholder={index == 0 ? t("commercial-certificate.placeholder") : t("commercial-certificate.placeholder-page", { page: index + 1 })}

                        path={"commercialCertificate"}
                        owner={watch().info.name}

                        index={index}
                        length={commercialCertificates.length}
                        remove={removeField}
                    />
                ))}
            </FieldSet>

            {getValues().info.type === "carrier" && (
                <>
                    <FieldSet className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                                <FieldLabel>{t("alvara.label")}</FieldLabel>
                                <FieldDescription className="text-xs">{t("alvara.description")}</FieldDescription>
                                {errors.kyc?.alvara?.root && (
                                    <FieldError errors={[errors.kyc?.alvara?.root]} />
                                )}
                            </FieldLegend>

                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => addField("alvara")}
                                disabled={alvaras.length == 5}
                            >
                                {t("button.add-page")}
                                <IconCirclePlus />
                            </Button>
                        </div>

                        {alvaras.map((field, index) => (
                            <FileInput
                                key={field.id}
                                control={control}
                                inputRef={alvaraRef[index]}
                                isPending={isSubmitting}
                                name={`kyc.alvara.${index}.url`}
                                placeholder={index == 0 ? t("alvara.placeholder") : t("alvara.placeholder-page", { page: index + 1 })}

                                path={"alvara"}
                                owner={watch().info.name}

                                index={index}
                                length={alvaras.length}
                                remove={removeField}
                            />
                        ))}
                    </FieldSet>

                    <FieldSet className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                                <FieldLabel>{t("bank-letter.label")}</FieldLabel>
                                <FieldDescription className="text-xs">{t("bank-letter.description")}</FieldDescription>
                                {errors.kyc?.bankLetter?.root && (
                                    <FieldError errors={[errors.kyc?.bankLetter?.root]} />
                                )}
                            </FieldLegend>

                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => addField("bankLetter")}
                                disabled={bankLetters.length == 2}
                            >
                                {t("button.add-page")}
                                <IconCirclePlus />
                            </Button>
                        </div>

                        {bankLetters.map((field, index) => (
                            <FileInput
                                key={field.id}
                                control={control}
                                inputRef={bankLetterRef[index]}
                                isPending={isSubmitting}
                                name={`kyc.bankLetter.${index}.url`}
                                placeholder={index == 0 ? t("bank-letter.placeholder") : t("bank-letter.placeholder-page", { page: index + 1 })}

                                path={"bankLetter"}
                                owner={watch().info.name}

                                index={index}
                                length={bankLetters.length}
                                remove={removeField}
                            />
                        ))}
                    </FieldSet>

                    <FieldSet className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                                <FieldLabel>{t("commercial-exercise.label")}</FieldLabel>
                                <FieldDescription className="text-xs">{t("commercial-exercise.description")}</FieldDescription>
                                {errors.kyc?.commercialExercise?.root && (
                                    <FieldError errors={[errors.kyc?.commercialExercise?.root]} />
                                )}
                            </FieldLegend>

                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => addField("commercialExercise")}
                                disabled={commercialExercises.length == 2}
                            >
                                {t("button.add-page")}
                                <IconCirclePlus />
                            </Button>
                        </div>

                        {commercialExercises.map((field, index) => (
                            <FileInput
                                key={field.id}
                                control={control}
                                inputRef={commercialExerciseRef[index]}
                                isPending={isSubmitting}
                                name={`kyc.commercialExercise.${index}.url`}
                                placeholder={index == 0 ? t("commercial-exercise.placeholder") : t("commercial-exercise.placeholder-page", { page: index + 1 })}

                                path={"commercialExercise"}
                                owner={watch().info.name}

                                index={index}
                                length={commercialExercises.length}
                                remove={removeField}
                            />
                        ))}
                    </FieldSet>

                    <FieldSet className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <FieldLegend className="mb-0 flex flex-col gap-1" variant="label">
                                <FieldLabel>{t("republic-bulletin.label")}</FieldLabel>
                                <FieldDescription className="text-xs">{t("republic-bulletin.description")}</FieldDescription>
                                {errors.kyc?.republicBulletin?.root && (
                                    <FieldError errors={[errors.kyc?.republicBulletin?.root]} />
                                )}
                            </FieldLegend>

                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => addField("republicBulletin")}
                                disabled={republicBulletins.length == 2}
                            >
                                {t("button.add-page")}
                                <IconCirclePlus />
                            </Button>
                        </div>

                        {republicBulletins.map((field, index) => (
                            <FileInput
                                key={field.id}
                                control={control}
                                inputRef={republicBulletinRef[index]}
                                isPending={isSubmitting}
                                name={`kyc.republicBulletin.${index}.url`}
                                placeholder={index == 0 ? t("republic-bulletin.placeholder") : t("republic-bulletin.placeholder-page", { page: index + 1 })}

                                path={"republicBulletin"}
                                owner={watch().info.name}

                                index={index}
                                length={republicBulletins.length}
                                remove={removeField}
                            />
                        ))}
                    </FieldSet>
                </>
            )}
        </FieldGroup>
    )
}
