import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ResumeView } from "@/modules/main/pages/dashboard/ui/views/resume-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.dashboard.resume.queryOptions()
    )
    
    return (
        <HydrateClient>
            <ResumeView />
        </HydrateClient>
    )
}
