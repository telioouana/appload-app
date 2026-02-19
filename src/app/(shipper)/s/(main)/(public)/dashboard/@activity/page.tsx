import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ActivityView } from "@/modules/shipper/main/public/pages/dashboard/ui/views/activity-view";

export default async function Page() {
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
