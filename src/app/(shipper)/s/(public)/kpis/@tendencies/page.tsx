import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { PERIOD } from "@/modules/app/routes/shipper/types/types";
import { TendenciesView } from "@/modules/app/routes/shipper/pages/kpis/views/tendencies-view";

export default async function Page({ searchParams }: { searchParams: Promise<{ period?: PERIOD }> }) {
    const { period } = await searchParams
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let startDate: Date
    let endDate: Date

    if (!period || period === "month") {
        // Logic for default "Last Month"
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
    } else if (period === "quarter") {
        const currentQuarterStartMonth = Math.floor(month / 3) * 3;
        startDate = new Date(year, currentQuarterStartMonth - 3, 1);
        endDate = new Date(year, currentQuarterStartMonth, 0);
    } else {
        startDate = new Date(year - 1, 0, 1);
        endDate = new Date(year - 1, 11, 31);
    }

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.shipperKpis.performance.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    await client.prefetchQuery(
        trpc.shipperKpis.incidents.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    await client.prefetchQuery(
        trpc.shipperKpis.savings.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    await client.prefetchQuery(
        trpc.shipperKpis.emissions.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
        })
    )

    return (
        <HydrateClient>
            <TendenciesView endDate={endDate} startDate={startDate} />
        </HydrateClient>
    )
}
