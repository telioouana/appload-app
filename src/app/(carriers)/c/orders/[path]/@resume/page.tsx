import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"
import { ResumeView } from "@/modules/app/routes/carrier/pages/orders/views/resume-view"

import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.orders.resume.queryOptions({
            path
        })
    )

    return (
        <HydrateClient>
            <ResumeView path={path} />
        </HydrateClient>
    )
}
