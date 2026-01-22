import { useTranslations } from "next-intl"
import { IconSend } from "@tabler/icons-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SelectItem } from "@/components/ui/select"
import { TextInput } from "@/components/customs/text"
import { EmailInput } from "@/components/customs/email"
import { SelectInput } from "@/components/customs/select"
import { FieldDescription, FieldGroup } from "@/components/ui/field"

import { InviteMemberForm as IMF, INVITE_ROLE } from "@/modules/account/pages/organization/ui/schema/validation"

export function InviteMemberForm() {
    const t = useTranslations("Account.organization.landing.invite")

    const { control, formState: { isSubmitting } } = useFormContext<IMF>()

    return (
        <FieldGroup>
            <TextInput
                control={control}
                name="name"
                label={t("form.name.label")}
                placeholder={t("form.name.placeholder")}
                isPending={isSubmitting}
            />

            <EmailInput
                control={control}
                name="email"
                label={t("form.email.label")}
                placeholder={t("form.email.placeholder")}
                isPending={isSubmitting}
            />

            <SelectInput
                control={control}
                name="role"
                label={t("form.role.label")}
                placeholder={t("form.role.placeholder")}
                isPending={isSubmitting}
            >
                {INVITE_ROLE.map((item, index) => (<SelectItem key={index} value={item}>{t(`form.role.options.${item}`)}</SelectItem>))}
            </SelectInput>

            <FieldDescription>{t("form.required")}</FieldDescription>

            <Button type="submit" disabled={isSubmitting}>
                {t("buttons.send")}
                {isSubmitting ? <Spinner /> : <IconSend />}
            </Button>
        </FieldGroup>
    )
}
