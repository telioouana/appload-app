import { TRIPS_PATH } from "@/modules/app/routes/carrier/types/types"

import { PageView } from "@/modules/app/routes/carrier/pages/trips/views/page-view"

export default async function Page({ params }: { params: Promise<{ path: TRIPS_PATH }> }) {
    const { path } = await params

    return <PageView path={path} />
}
