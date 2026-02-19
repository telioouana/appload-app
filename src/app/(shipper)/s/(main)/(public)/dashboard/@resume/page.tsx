import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ResumeView } from "@/modules/shipper/main/public/pages/dashboard/ui/views/resume-view";

export default async function Page() {
    const endDate = new Date()
    const startDate = new Date(new Date().setDate(endDate.getDate() - 30))

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.dashboard.resume.queryOptions({
            startDate,
            endDate
        })
    )

    return (
        <HydrateClient>
            <ResumeView endDate={endDate} startDate={startDate} />
        </HydrateClient>
    )
}
