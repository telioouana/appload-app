import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { ClientsResumeView } from "@/modules/app/routes/carrier/pages/clients/views/resume-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.clients.resume.queryOptions()
    )

    return (
        <HydrateClient>
            <ClientsResumeView />
        </HydrateClient>
    )
}
