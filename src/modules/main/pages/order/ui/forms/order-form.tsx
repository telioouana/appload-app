
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form";

import { CreateOrderForm as COF, SHARE } from "@/backend/db/types";
import { CATEGORIES, PACKING, WEIGHT_UNIT } from "@/backend/db/types";

import { FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { TextInput } from "@/components/customs/text";
import { DateInput } from "@/components/customs/date";
import { NumberInput } from "@/components/customs/number";
import { SelectInput } from "@/components/customs/select";
import { SliderInput } from "@/components/customs/slider";
import { CheckboxInput } from "@/components/customs/checkbox";
import { LocationInput } from "@/components/customs/location";
import { TextAreaInput } from "@/components/customs/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrderForm({ isPending }: { isPending: boolean }) {
    const t = useTranslations("Main.order.create.form")

    const form = useFormContext<COF>()

    return (
        <FieldGroup className="max-h-100 overflow-y-scroll container-snap p-2.5">
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

            <div className="grid grid-cols-3 gap-4">
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

                <SelectInput
                    control={form.control}
                    name="cargo.unit"
                    label={t("cargo.unit.label")}
                    placeholder={t("cargo.unit.placeholder")}
                    isPending={form.formState.isSubmitting || isPending}
                >
                    {WEIGHT_UNIT.map((item, index) => <SelectItem key={index} value={item}>{item}</SelectItem>)}
                </SelectInput>
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

            <Tabs className="w-full" value={form.watch().share}>
                <TabsList className="w-full">
                    {SHARE.map((item, index) => (
                        <TabsTrigger
                            key={index}
                            value={item}
                            onClick={() => form.setValue("share", item)}
                        >
                            {t(`share.options.${item}`)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </FieldGroup>
    )
}
