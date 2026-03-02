import { PageView } from "@/modules/app/routes/carrier/pages/orders/views/page-view"
import { ORDERS_PATH } from "@/modules/app/routes/carrier/types/types"

export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <PageView path={path} />
}
