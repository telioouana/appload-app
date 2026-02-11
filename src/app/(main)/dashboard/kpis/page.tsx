import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { getQueryClient, HydrateClient, trpc } from "@/backend/trpc/server";

import { UserType } from "@/modules/main/ui/types";
import { KPIsView } from "@/modules/main/pages/kpis/ui/views/kpis-view";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return redirect("/sign-in")
    const { user: { type: sessionType } } = session
    const userType: UserType | undefined = sessionType === "shipper" || sessionType === "carrier"
        ? sessionType
        : undefined

    if (!userType) {
        await auth.api.signOut({
            headers: await headers()
        })
        return redirect("/sign-in")
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Logic for default "Last Month"
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const client = getQueryClient()

    await client.prefetchQuery(
        trpc.kpis.all.queryOptions({
            endDate,
            startDate,
            currency: "MZN",
            section: "operational",
        })
    )

    return (
        <HydrateClient>
            <KPIsView endDate={endDate} startDate={startDate} userType={userType} />
        </HydrateClient>
    )
}
