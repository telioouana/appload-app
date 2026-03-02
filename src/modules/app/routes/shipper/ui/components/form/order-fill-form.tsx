import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form";

import { CreateOrderForm as COF, CATEGORIES, PACKING, SHARE } from "@/backend/db/types";

import { SelectItem } from "@/components/ui/select";
import { TextInput } from "@/components/customs/text";
import { DateInput } from "@/components/customs/date";
import { NumberInput } from "@/components/customs/number";
import { SelectInput } from "@/components/customs/select";
import { SliderInput } from "@/components/customs/slider";
import { CheckboxInput } from "@/components/customs/checkbox";
import { LocationInput } from "@/components/customs/location";
import { TextAreaInput } from "@/components/customs/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle, } from "@/components/ui/field";


export function OrderFillForm({ isPending, share }: { isPending?: boolean, share: typeof SHARE[number] }) {
    const t = useTranslations("Shipper.order.dialog.form")

    const form = useFormContext<COF>()

    return (
        <FieldGroup className="max-h-100 overflow-y-scroll container-snap px-8">
            <div className="grid grid-cols-2 gap-4">
                <LocationInput
                    control={form.control}
                    name={`loadingAddress.${0}.address`}
                    label={t("loading-address.label")}
                    placeholder={t("loading-address.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                    setCountry={(value: string) => form.setValue(`loadingAddress.${0}.country`, value)}
                    setPlaceId={(value: string) => form.setValue(`loadingAddress.${0}.placeId`, value)}
                    setState={(value: string) => form.setValue(`loadingAddress.${0}.state`, value)}
                />

                <LocationInput
                    control={form.control}
                    name={`offloadingAddress.${0}.address`}
                    label={t("offloading-address.label")}
                    placeholder={t("offloading-address.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                    setCountry={(value: string) => form.setValue(`offloadingAddress.${0}.country`, value)}
                    setPlaceId={(value: string) => form.setValue(`offloadingAddress.${0}.placeId`, value)}
                    setState={(value: string) => form.setValue(`offloadingAddress.${0}.state`, value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <DateInput
                    control={form.control}
                    name="expectedLoadingDate"
                    label={t("expected-loading-date.label")}
                    placeholder={t("expected-loading-date.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />

                <DateInput
                    control={form.control}
                    name="expectedOffloadingDate"
                    label={t("expected-offloading-date.label")}
                    placeholder={t("expected-offloading-date.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SelectInput
                    control={form.control}
                    name="cargo.category"
                    label={t("cargo.category.label")}
                    placeholder={t("cargo.category.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                >
                    {CATEGORIES.map((item, index) => <SelectItem key={index} value={item}>{t(`cargo.category.options.${item}`)}</SelectItem>)}
                </SelectInput>

                <TextInput
                    control={form.control}
                    name="cargo.description"
                    label={t("cargo.description.label")}
                    placeholder={t("cargo.description.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <SelectInput
                    control={form.control}
                    name="cargo.packing"
                    label={t("cargo.packing.label")}
                    placeholder={t("cargo.packing.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                >
                    {PACKING.map((item, index) => <SelectItem key={index} value={item}>{t(`cargo.packing.options.${item}`)}</SelectItem>)}
                </SelectInput>

                <NumberInput
                    control={form.control}
                    name="cargo.quantity"
                    label={t("cargo.quantity.label")}
                    placeholder={t("cargo.quantity.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />
            </div>

            <CheckboxInput
                control={form.control}
                name="cargo.isGroupageAllowed"
                label={t("cargo.is-groupage-allowed")}
                isPending={form.formState.isSubmitting || isPending}
            />

            <CheckboxInput
                control={form.control}
                name="cargo.isHazardous"
                label={t("cargo.is-hazardous")}
                isPending={form.formState.isSubmitting || isPending}
            />
            {form.watch().cargo.isHazardous && (
                <TextInput
                    control={form.control}
                    name="cargo.hazchemCode"
                    label={t("cargo.hazchem-code.label")}
                    placeholder={t("cargo.hazchem-code.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />
            )}

            <CheckboxInput
                control={form.control}
                name="cargo.isRefrigerated"
                label={t("cargo.is-refrigerated")}
                isPending={form.formState.isSubmitting || isPending}
            />
            {form.watch().cargo.isRefrigerated && (
                <>
                    <SliderInput
                        control={form.control}
                        name="cargo.temperature"
                        label={t("cargo.temperature.label")}
                        message={t("cargo.temperature.message")}
                        step={1}
                        max={25}
                        min={-25}
                        isPending={form.formState.isSubmitting || isPending}
                    />
                    <TextAreaInput
                        control={form.control}
                        name="cargo.temperatureInstructions"
                        label={t("cargo.temperature-instructions.label")}
                        placeholder={t("cargo.temperature-instructions.placeholder")}
                        isPending={form.formState.isSubmitting || isPending}
                    />
                </>
            )}

            {share === "subscribers" && (
                <FieldGroup className="w-full">
                    <FieldSet>
                        <FieldLegend variant="label">{t("share.label")}</FieldLegend>
                        <FieldDescription>{t("share.description")}</FieldDescription>
                        
                        <RadioGroup
                            defaultValue={form.watch().share}
                            className="flex gap-4"
                            onValueChange={(value) => {
                                form.setValue("share", value as typeof SHARE[number])
                                if (value === SHARE[1]) {
                                    form.setValue("price", undefined)
                                }
                            }}
                        >
                            <FieldLabel htmlFor="subscribers-r2h">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>{t("share.subscribers.label")}</FieldTitle>
                                        <FieldDescription>{t("share.subscribers.description")}</FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="subscribers" id="subscribers-r2h" />
                                </Field>
                            </FieldLabel>

                            <FieldLabel htmlFor="non-subscribers-z4k">
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>{t("share.non-subscribers.label")}</FieldTitle>
                                        <FieldDescription>{t("share.non-subscribers.description")}</FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="non-subscribers" id="non-subscribers-z4k" />
                                </Field>
                            </FieldLabel>
                        </RadioGroup>
                    </FieldSet>
                </FieldGroup>
            )}

            {form.watch().share === "subscribers" && (
                <NumberInput
                    control={form.control}
                    name="price"
                    label={t("price.label")}
                    placeholder={t("price.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                />
            )}
        </FieldGroup>
    )
}
