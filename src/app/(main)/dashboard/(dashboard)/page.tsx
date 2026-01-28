import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"

import { DashboardView } from "@/modules/main/pages/dashboard/ui/views/dashboard-view"

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    return <DashboardView />
}
