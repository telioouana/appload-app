import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"

export default async function Page({ searchParams }: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await searchParams

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect("/sign-in")
    }

    const { user: { type } } = session

    if (type === "shipper" || type === "carrier") {
        redirect(`/${type.charAt(0)}/${callback}`)
    }

    redirect("/unauthorized")
}
