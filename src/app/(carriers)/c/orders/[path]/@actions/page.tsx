import { ActionsView } from "@/modules/app/routes/carrier/pages/orders/views/actions-view"

export default async function Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const { search } = await searchParams

    return <ActionsView initialSearch={search} />
}
