import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"

import { SessionsView } from "@/modules/app/routes/user/pages/account/security-and-privacy/views/sessions-view"
import { SecurityView } from "@/modules/app/routes/user/pages/account/security-and-privacy/views/security-view"

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() })
    const sessions = await auth.api.listSessions({ headers: await headers() })

    if (session === null || sessions === null) return redirect("/sign-in")
        
    return (
        <div className="space-y-6">
            <SessionsView session={session.session} sessions={sessions} />

            <SecurityView user={session.user} />
        </div>
    )
}
