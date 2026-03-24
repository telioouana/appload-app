import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { TransportersResumeView } from "@/modules/app/routes/shipper/pages/private/pages/transporters/views/transporters-resume-view";

export default async function Page() {
    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.transporters.resume.queryOptions()
    )

    return (
        <HydrateClient>
            <TransportersResumeView />
        </HydrateClient>
    )
}
