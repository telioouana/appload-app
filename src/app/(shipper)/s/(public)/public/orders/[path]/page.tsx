import { ORDERS_PATH } from "@/modules/app/routes/shipper/types/types"
import { PublicPageView } from "@/modules/app/routes/shipper/pages/public/pages/orders/views/public-page-view"


export default async function Page({ params }: { params: Promise<{ path: ORDERS_PATH }> }) {
    const { path } = await params

    return <PublicPageView path={path} />
}
