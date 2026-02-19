import { ORDERS_PATH } from "@/modules/shipper/main/types/types"
import { PageView } from "@/modules/shipper/main/private/pages/orders/ui/views/page-view"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <PageView path={path} />
}
