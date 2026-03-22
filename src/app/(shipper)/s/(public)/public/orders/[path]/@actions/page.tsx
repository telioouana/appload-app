import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { OrdersActionsView } from "@/modules/app/routes/shipper/ui/views/orders-actions-view"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return (
        <OrdersActionsView path={path} />
    )
}
