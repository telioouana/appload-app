import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"

import { auth } from "@/backend/auth"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export default async function Page({ searchParams }: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await searchParams
    const sessionCookies = await cookies()

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        const dont_remember = sessionCookies.get("better-auth.dont_remember")
        const session_token = sessionCookies.get("better-auth.session_token")

        if (dont_remember || session_token) {
            sessionCookies.delete("better-auth.dont_remember")
            sessionCookies.delete("better-auth.session_token")
        }
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
