import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { KPIsView } from "@/modules/shipper/main/public/pages/kpis/ui/views/kpis-view";

export default async function Page() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Logic for default "Last Month"
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.kpis.report.queryOptions({
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
