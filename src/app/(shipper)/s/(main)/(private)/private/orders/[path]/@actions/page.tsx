import { ORDERS_PATH } from "@/modules/shipper/main/types/types"
import { ActionsView } from "@/modules/shipper/main/private/pages/orders/ui/views/actions-view";

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return (
        <ActionsView  path={path} />
    )
}
