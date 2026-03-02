import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";


export default async function Page({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
    

    return (
        <HydrateClient>
            <div />
        </HydrateClient>
    )
}
