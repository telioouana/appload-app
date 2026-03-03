import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export default async function Page({ searchParams }: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await searchParams

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect("/sign-in")
    }

    const { user: { type } } = session

    const callbarkURL = decodeURIComponent(callback)

    if (type === "shipper" || type === "carrier") {
        if (callbarkURL && callbarkURL.startsWith(`/${type.charAt(0)}`)) {
            redirect(callbarkURL)
        }
        redirect(`/${type.charAt(0)}/${DEFAULT_LOGIN_REDIRECT}`)
    }

    redirect("/unauthorized")
}
