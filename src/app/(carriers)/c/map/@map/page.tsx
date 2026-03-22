import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { MapView } from "@/modules/app/routes/carrier/pages/map/views/map-view";

type Props = {
    searchParams: Promise<{
        search?: string;
        filterBy?: string;
    }>;
};

export default async function Page({ searchParams }: Props) {
    const { search, filterBy } = await searchParams;
    const client = getQueryClient();

    const filters = {
        search: search?.trim() || undefined,
        filterBy: filterBy || "all",
    };

    await client.prefetchQuery(
        trpc.carrierMap.positions.queryOptions(filters)
    )
    return (
        <HydrateClient>
            <MapView
                search={filters.search}
                filterBy={filters.filterBy}
            />
        </HydrateClient>
    )
}
