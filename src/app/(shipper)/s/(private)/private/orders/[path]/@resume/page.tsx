import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { ResumeView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/resume-view"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.private.resume.queryOptions({
            path
        })
    )

    return (
        <HydrateClient>
            <ResumeView path={path} />
        </HydrateClient>
    )
}
