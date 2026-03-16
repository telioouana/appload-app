import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { PERIOD } from "@/modules/app/routes/shipper/types/types";
import { KPIsView } from "@/modules/app/routes/shipper/pages/kpis/views/kpis-view";

export default async function Page({ searchParams }: { searchParams: Promise<{ period?: PERIOD }> }) {
    const { period } = await searchParams
    const now = new Date();
    // const year = now.getFullYear();
    // const month = now.getMonth();

    let startDate: Date
    let endDate: Date

    switch (period) {
        case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            endDate = new Date();
            break;
        case "month":
            startDate = new Date(now.setDate(now.getDate() - 30));
            endDate = new Date();
            break;
        case "quarter":
            startDate = new Date(now.setDate(now.getDate() - 90));
            endDate = new Date();
            break;
        case "year":
            startDate = new Date(now.setDate(now.getDate() - 365));
            endDate = new Date();
            break;
        default:
            // Fallback to month for invalid query values
            startDate = new Date(now.setDate(now.getDate() - 30));
            endDate = new Date();
            break;
    }

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
