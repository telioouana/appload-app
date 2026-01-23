import { toast } from "sonner";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEdgeStore } from "@/lib/edgestore";
import { FieldPath, useFieldArray, useFormContext } from "react-hook-form"
import { IconCheck, IconChevronLeft, IconCirclePlus } from "@tabler/icons-react";

import { FISCAL_REGIME } from "@/backend/db/types";
import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SelectItem } from "@/components/ui/select";
import { FileInput } from "@/components/customs/file";
import { SelectInput } from "@/components/customs/select";
import { FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";

import { countryCodes } from "@/lib/country-codes";
import { inferKYC } from "@/modules/account/pages/create-organization/server/procedures";
import { CreateOrganizationForm, View } from "@/modules/account/pages/create-organization/ui/schema/validation";

type Props = {
    changeView: (view: View) => void
}

export function KYCInfo({ changeView }: Props) {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const t = useTranslations("Account.organization.create.form.kyc")
    const router = useRouter()
    const { edgestore } = useEdgeStore()

    const { clearErrors, control, formState: { errors }, getValues, trigger, watch } = useFormContext<CreateOrganizationForm>()

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
            minLength: 1,
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

    const removeField = (path: string, index: number) =>
        path === "id" ? removeId(index) :
            path === "nuit" ? removeNuit(index) :
                path === "alvara" ? removeAlvara(index) :
                    path === "bankLetter" ? removeBankLetter(index) :
                        path === "republicBulletin" ? removeRepublicBulletin(index) :
                            path === "commercialExercise" ? removeCommercialExercise(index) :
                                path === "commercialCertificate" ? removeCommercialCertificate(index) :
                                    null

    async function handleSubmit(values: CreateOrganizationForm) {
        clearErrors()
        let fields: FieldPath<CreateOrganizationForm>[] = []

        if (values.info.type == "shipper") {
            fields = ["kyc.idCard", "kyc.nuit", "kyc.commercialCertificate"]
        } else {
            fields = ["kyc.idCard", "kyc.nuit", "kyc.fiscalRegime", "kyc.alvara", "kyc.bankLetter", "kyc.commercialExercise", "kyc.republicBulletin"]
        }

        const output = await trigger(fields, { shouldFocus: true })
        if (!output) return

        setSubmitting(true)
        let organizationId: string | undefined

        try {
            const { data, error } = await authClient.organization.create({
                type: values.info.type,
                name: values.info.name,
                slug: values.info.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                nuit: values.info.nuit,
                email: values.info.email,
                phoneNumber: `${countryCodes.find(({ country }) => country === values.info.country)?.code ?? ""}${values.info.phoneNumber}`,
                billingAddress: values.info.billingAddress,
                physicalAddress: values.info.physicalAddress,
                subscriptionPlan: "free",
                status: "pending"
            })
            if (error || !data) {
                // TODO: Customize message
                toast.error("Something went wrong")
                return
            }

            organizationId = data.id
            await inferKYC(values, data.id)

            await Promise.all(
                values.kyc.idCard.map(({ url }) =>
                    edgestore.apploadFiles.confirmUpload({ url })
                )
            )

            await Promise.all(
                values.kyc.nuit.map(({ url }) =>
                    edgestore.apploadFiles.confirmUpload({ url })
                )
            )

            if (values.info.type == "shipper") {
                await Promise.all(
                    values.kyc.commercialCertificate.map(({ url }) =>
                        edgestore.apploadFiles.confirmUpload({ url })
                    )
                )
            } else {
                await Promise.all(
                    values.kyc.alvara.map(({ url }) =>
                        edgestore.apploadFiles.confirmUpload({ url })
                    )
                )

                await Promise.all(
                    values.kyc.bankLetter.map(({ url }) =>
                        edgestore.apploadFiles.confirmUpload({ url })
                    )
                )

                await Promise.all(
                    values.kyc.republicBulletin.map(({ url }) =>
                        edgestore.apploadFiles.confirmUpload({ url })
                    )
                )

                await Promise.all(
                    values.kyc.commercialExercise.map(({ url }) =>
                        edgestore.apploadFiles.confirmUpload({ url })
                    )
                )

                if (values.kyc.commercialCertificate.length > 0) {
                    await Promise.all(
                        values.kyc.commercialCertificate.map(({ url }) =>
                            edgestore.apploadFiles.confirmUpload({ url })
                        )
                    )
                }
            }

            await authClient.organization.setActive({
                organizationId: data.id
            })

            router.push("/company")

        } catch (err) {
            console.error(err)
            if (organizationId) {
                await authClient.organization.delete({ organizationId })
            }
            // TODO: Customize message
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

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

            <div className="flex w-full gap-4 justify-end items-center mt-4">
                <div className="w-full" />

                <div className="w-full flex justify-end gap-4">
                    <div className="w-full">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isSubmitting}
                            onClick={() => changeView("organization-info")}
                        >
                            <IconChevronLeft />
                            {t("button.back")}
                        </Button>
                    </div>

                    <div className="w-full">
                        <Button
                            type="button"
                            className="w-full"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit(getValues())}
                        >
                            {t("button.register")}
                            {isSubmitting ? <Spinner /> : <IconCheck />}
                        </Button>
                    </div>
                </div>
            </div>
        </FieldGroup>
    )
}
