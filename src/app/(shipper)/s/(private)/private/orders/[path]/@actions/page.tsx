import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { ActionsView } from "@/modules/app/routes/shipper/pages/private/pages/orders/views/actions-view"


export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return (
        <ActionsView path={path} />
    )
}
