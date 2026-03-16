import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { KPIsView } from "@/modules/app/routes/shipper/pages/kpis/views/kpis-view";

export default async function Page() {
    const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth();

    // Logic for default "Last 30 days"
    const startDate = new Date(now.setDate(now.getDate() - 30));
    const endDate = new Date();

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.shipperKpis.report.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
            section: "operational",
        })
    )

    return (
        <HydrateClient>
            <KPIsView endDate={endDate} startDate={startDate} />
        </HydrateClient>
    )
}
