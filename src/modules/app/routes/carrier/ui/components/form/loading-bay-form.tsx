import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form";

import { LOADING_BAY } from "@/backend/db/types";

import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SelectInput } from "@/components/customs/select";
import { NumberInput } from "@/components/customs/number";
import { FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";

import { FullFleetForm } from "../dialog/register-fleet-dialog";

export function LoadingBayForm({ name }: { name: "truck" | "trailer" | "link" }) {
    const t = useTranslations("Carrier.company.fleet.dialog.form.loading-bay")

    const { control, formState: { isSubmitting } } = useFormContext<FullFleetForm>()

    return (
        <FieldSet className="flex flex-col">
            <FieldLegend className="flex flex-col gap-2 w-full" variant="label">
                <FieldLabel>{t("label")}</FieldLabel>
                <Separator />
            </FieldLegend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                    control={control}
                    name={`${name}.loadingBay.width`}
                    isPending={isSubmitting}
                    label={t("width.label")}
                    placeholder={t("width.placeholder")}
                />

                <NumberInput
                    control={control}
                    name={`${name}.loadingBay.height`}
                    isPending={isSubmitting}
                    label={t("height.label")}
                    placeholder={t("height.placeholder")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                    control={control}
                    name={`${name}.loadingBay.length`}
                    label={t("length.label")}
                    isPending={isSubmitting}
                    placeholder={t("length.placeholder")}
                />

                <NumberInput
                    control={control}
                    name={`${name}.loadingBay.volume`}
                    label={t("volume.label")}
                    isPending={isSubmitting}
                    placeholder={t("volume.placeholder")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                    control={control}
                    name={`${name}.loadingBay.capacity`}
                    label={t("capacity.label")}
                    isPending={isSubmitting}
                    placeholder={t("capacity.placeholder")}
                />

                <SelectInput
                    control={control}
                    name={`${name}.loadingBay.type`}
                    label={t("type.label")}
                    isPending={isSubmitting}
                    placeholder={t("type.placeholder")}
                >
                    {LOADING_BAY.map((item, index) => <SelectItem key={index} value={item}>{t(`type.options.${item}`)}</SelectItem>)}
                </SelectInput>
            </div>
        </FieldSet>
    )
}