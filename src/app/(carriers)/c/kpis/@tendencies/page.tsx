import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { PERIOD } from "@/modules/app/routes/carrier/types/types";
import { CarrierTendenciesView } from "@/modules/app/routes/carrier/pages/kpis/views/carrier-tendencies-view";

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
        case undefined:
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
            return;
    }

    const client = getQueryClient()

    await Promise.all([
        client.prefetchQuery(
            trpc.carrierKpis.onTime.queryOptions({
                endDate,
                startDate,
                currency: 'MZN',
            })
        ),
        client.prefetchQuery(
            trpc.carrierKpis.incidents.queryOptions({
                endDate,
                startDate,
                currency: 'MZN',
            })
        ),
        client.prefetchQuery(
            trpc.carrierKpis.loading.queryOptions({
                endDate,
                startDate,
                currency: 'MZN',
            })
        ),
        client.prefetchQuery(
            trpc.carrierKpis.offloading.queryOptions({
                endDate,
                startDate,
                currency: 'MZN',
            })
        ),
    ]);

    return (
        <HydrateClient>
            <CarrierTendenciesView endDate={endDate} startDate={startDate} />
        </HydrateClient>
    )
}
