import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"

import { TripsPageView } from "@/modules/app/routes/carrier/pages/trips/views/trips-page-view"

export default async function Page({ params }: { params: Promise<{ path: TRIPS_PATH }> }) {
    const { path } = await params

    return <TripsPageView path={path} />
}
