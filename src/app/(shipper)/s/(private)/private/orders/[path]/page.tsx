import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PrivatePageView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/private-page-view"


export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <PrivatePageView path={path} />
}
