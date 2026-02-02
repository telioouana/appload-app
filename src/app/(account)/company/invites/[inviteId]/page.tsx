import { headers } from "next/headers";

import { auth } from "@/backend/auth";
import { redirect } from "next/navigation";

import { InvitesView } from "@/modules/account/pages/invites/views/invites-view"

export default async function Page({ params }: { params: Promise<{ inviteId: string }> }) {
    const { inviteId } = await params

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) redirect("/sign-in")

    const invitation = await auth.api.getInvitation({
        query: {
            id: inviteId
        },
        headers: await headers(),
    }).catch((error) => {
        console.error("Failed to fetch invitation:", error)
        return undefined
    })

    if (!invitation) {
        return <div className="h-full w-full items-center justify-center flex flex-col">Invitation expired</div>
    }

    return (
        <InvitesView
            invitation={invitation}
        />
    )
}
