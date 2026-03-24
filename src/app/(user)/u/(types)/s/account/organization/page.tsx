import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/backend/auth"
import { FullOrganization } from "@/backend/auth/types"

import { TYPE } from "@/modules/app/routes/user/pages/account/organization/schemas/organization"
import { HeaderView } from "@/modules/app/routes/user/pages/account/organization/views/header-view"
import { TeamManagementView } from "@/modules/app/routes/user/pages/account/organization/views/team-management-view"
import { CreateOrganizationView } from "@/modules/app/routes/user/pages/account/organization/views/create-organization-view"
import { OrganizationManagementView } from "@/modules/app/routes/user/pages/account/organization/views/organization-management-view"

export default async function Page() {
    const session = await auth.api.getSession({ headers: await headers() })
    const organization = await auth.api.getFullOrganization({ headers: await headers() })

    if (session === null) return redirect("/sign-in")

    if (!session.session.activeOrganizationId || !organization?.id) {
        return <CreateOrganizationView type={session.user.type as typeof TYPE[number]}/>
    }

    return (
        <div className="space-y-6">
            <HeaderView />
            <OrganizationManagementView organization={organization as FullOrganization} />
            <TeamManagementView members={organization.members} invitations={organization.invitations}/>
        </div>
    )
}
