import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ResumeView } from "@/modules/app/routes/carrier/pages/drivers/views/resume-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.driver.resume.queryOptions()
    )

    return (
        <HydrateClient>
            <ResumeView />
        </HydrateClient>
    )
}
