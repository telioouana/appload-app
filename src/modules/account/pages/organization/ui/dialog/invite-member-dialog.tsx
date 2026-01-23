"use client"

import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl"
import { IconUserPlus } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form"

import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"

import { INVITE_ROLE } from "@/modules/account/pages/organization/ui/schema/validation";
import { useInviteMember } from "@/modules/account/pages/organization/hooks/use-invite-member"
import { InviteMemberForm } from "@/modules/account/pages/organization/ui/forms/invite-member-form";

export function InviteMemberDialog() {
    const { isOpen, onClose, onOpenChange } = useInviteMember()
    const t = useTranslations("Account.organization.landing.invite")

    const InviteMemberSchema = z.object({
        name: z.string({ error: t("form.name.error") }),
        email: z.email({
            error: (issue) =>
                issue.input === undefined || issue.input === ""
                    ? t("form.email.error.empty")
                    : t("form.email.error.invalid")
        }),
        role: z.enum(INVITE_ROLE, { error: t("form.role.error") }),
    })

    type InviteMemberForm = z.infer<typeof InviteMemberSchema>

    const form = useForm<InviteMemberForm>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: {
            role: "member"
        }
    })

    async function handleSubmit(values: InviteMemberForm) {
        form.clearErrors()

        await authClient.organization.inviteMember(values, {
            onError: (({ error }) => {
                toast.error(error.statusText ?? "Failed to send invitation email")
                return
            }),
            onSuccess: () => {
                toast.success("Member invitation email was sent successfully")
                form.reset()
                onClose()
            }
        })
    }

    return (
        <>
            <Button
                type="button"
                onClick={onOpenChange}
            >
                {t("buttons.invite")}
                <IconUserPlus />
            </Button>

            <ResponsiveDialog
                title={t("header.title")}
                description={t("header.description")}
                onClose={onClose}
                open={isOpen}
                type="dialog"
            >
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <InviteMemberForm />
                    </form>
                </FormProvider>
            </ResponsiveDialog>
        </>
    )
}
