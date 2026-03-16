import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ResumeView } from "@/modules/app/routes/carrier/pages/history/views/resume-view"

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.history.resume.queryOptions()
    )

    return (
        <HydrateClient>
            <ResumeView/>
        </HydrateClient>
    )
}
