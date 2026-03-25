import { OrdersPageView } from "@/modules/app/routes/carrier/pages/orders/views/orders-page-view"
import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <OrdersPageView path={path} />
}
