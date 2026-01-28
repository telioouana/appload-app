import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ActivityView } from "@/modules/main/pages/dashboard/ui/views/activity-view";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.dashboard.activity.queryOptions()
    )

    return (
        <HydrateClient>
            <ActivityView />
        </HydrateClient>
    )
}
