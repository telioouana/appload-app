import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { UserType } from "@/modules/main/ui/types";
import { ResumeView } from "@/modules/main/pages/dashboard/ui/views/resume-view";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")
    const { user: { type: sessionType } } = session
    const userType: UserType | undefined = sessionType === "shipper" || sessionType === "carrier"
        ? sessionType
        : undefined

    if (!userType) {
        await auth.api.signOut()
        return redirect("/sign-in")
    }

    const endDate = new Date()
    const startDate = new Date(new Date().setDate(endDate.getDate() - 30))
    const client = getQueryClient()

    void client.prefetchQuery(
        trpc.dashboard.resume.queryOptions({
            startDate,
            endDate
        })
    )
    return (
        <HydrateClient>
            <ResumeView endDate={endDate} startDate={startDate} userType={userType} />
        </HydrateClient>
    )
}
