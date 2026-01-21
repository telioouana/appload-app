import { Resend } from "resend";
import { APIError } from "better-auth";
import { getTranslations } from "next-intl/server";

import { InvitationEmail } from "@/components/email/invitation-email";
import { VerificationEmail } from "@/components/email/verification-email";

const resend = new Resend(process.env.RESEND_API_SECRET)

const FROM = "Appload <no-reply@no-reply.appload.co.mz>"

type VerificationProps = {
    email: string,
    name: string,
    url: string,
}

export async function sendVerificationEmail({ email, url, name }: VerificationProps) {
    const t = await getTranslations("Emails.verify-email")

    const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: t("subject"),
        react: VerificationEmail({ name, url })
    })

    if (error) throw new APIError("INTERNAL_SERVER_ERROR")
}

type InvitationProps = {
    email: string,
    inviter: string,
    invitationId: string,
    organization: string,
}

export async function sendInviteEmail({ email, inviter, invitationId, organization, }: InvitationProps) {
    const t = await getTranslations("Emails.invite-email")
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/company/invites/${invitationId}`

    const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: t("subject", { organization: organization }),
        react: InvitationEmail({ inviter, organization, url })
    })

    if (error) throw new APIError("INTERNAL_SERVER_ERROR")
}