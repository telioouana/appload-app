import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { FLEET_STATUS } from "@/backend/db/types"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server"

import { LAYOUT_VIEW, STATUS_FILTER } from "@/modules/app/routes/carrier/types/types"
import { DriversView } from "@/modules/app/routes/carrier/pages/drivers/views/drivers-view"

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: STATUS_FILTER, view?: LAYOUT_VIEW, search?: string }> }) {
    const { status: filter, view, search } = await searchParams
    const client = getQueryClient()

    const status = filter as typeof FLEET_STATUS[number] | undefined
    await client.prefetchInfiniteQuery(
        trpc.driver.drivers.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT,
            status
        })
    )

    return (
        <HydrateClient>
            <DriversView status={status} view={view} search={search} />
        </HydrateClient>
    )
}
