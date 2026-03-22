import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export default async function Page({ searchParams }: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await searchParams

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in")
    }

    const { user: { type, emailVerified }, session: { activeOrganizationId } } = session
    if (type === "shipper" || type === "carrier") {
        if (!emailVerified) {
            redirect(`/u/${type.charAt(0)}/account/profile`)
        }

        if (!activeOrganizationId) {
            redirect(`/u/${type.charAt(0)}/account/organization`)
        }

        const callbarkURL = decodeURIComponent(callback)

        if (callbarkURL && callbarkURL.startsWith(`/${type.charAt(0)}`)) {
            redirect(callbarkURL)
        }
        redirect(`/${type.charAt(0)}${DEFAULT_LOGIN_REDIRECT}`)
    }

    redirect("/unauthorized")
}
