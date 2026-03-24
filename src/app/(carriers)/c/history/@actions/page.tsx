import { ActionsView } from "@/modules/app/routes/carrier/pages/history/views/actions-view"

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const { search } = await searchParams

    return <ActionsView initialSearch={search} />
}
