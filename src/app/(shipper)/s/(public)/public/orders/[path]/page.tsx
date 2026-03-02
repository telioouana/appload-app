import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PageView } from "@/modules/app/routes/shipper/pages/public/pages/orders/views/page-view"


export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <PageView path={path} />
}
