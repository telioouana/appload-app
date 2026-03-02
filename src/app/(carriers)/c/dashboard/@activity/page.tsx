import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ActivityView } from "@/modules/app/routes/carrier/pages/dashboard/views/activity-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.shipperDashboard.activity.queryOptions()
    )

    return (
        <HydrateClient>
            <ActivityView />
        </HydrateClient>
    )
}
