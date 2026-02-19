import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"
import { ResumeView } from "@/modules/shipper/main/private/pages/orders/ui/views/resume-view"

import { ORDERS_PATH } from "@/modules/shipper/main/types/types"

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
