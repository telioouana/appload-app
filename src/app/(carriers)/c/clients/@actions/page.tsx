import { ClientsActionsView } from "@/modules/app/routes/carrier/pages/clients/views/actions-view";

export default async function Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const { search } = await searchParams

    return (
        <ClientsActionsView initialSearch={search} />
    )
}
