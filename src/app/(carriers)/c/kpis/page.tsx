import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

export default async function Page() {
    

    return (
        <HydrateClient>
            <div />
        </HydrateClient>
    )
}
