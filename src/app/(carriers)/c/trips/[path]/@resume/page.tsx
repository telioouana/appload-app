import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"
import { ResumeView } from "@/modules/app/routes/carrier/pages/trips/views/resume-view"

export default async function Page({ params }: { params: Promise<{ path: TRIPS_PATH }> }) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.trips.resume.queryOptions({
            path
        })
    )

    return (
        <HydrateClient>
            <ResumeView path={path} />
        </HydrateClient>
    )
}
