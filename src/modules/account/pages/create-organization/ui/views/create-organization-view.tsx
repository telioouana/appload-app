"use client"

import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Loader } from "@/components/customs/loader";

import { View } from "@/modules/account/pages/create-organization/ui/schema/validation";
import { CreacteOrganizationHeaderSection } from "@/modules/account/pages/create-organization/ui/sections/creacte-organization-header-section";
import { CreacteOrganizationContentSection } from "@/modules/account/pages/create-organization/ui/sections/creacte-organization-content-section";

import { authClient } from "@/backend/auth/auth-client";

type Props = {
    view: View
}

export function CreateOrganizationView({ view }: Props) {
    const { data, isPending } = authClient.useSession()

    if (isPending) {
        return (
            <div className="h-full w-full items-center justify-center flex flex-col">
                <Loader />
            </div>
        )
    }

    if (!data?.user) { redirect("/sign-in") }

    const { user } = data

    return (
        <Card className="w-full overflow-y-scroll container-snap mb-10">
            <CreacteOrganizationHeaderSection />
            <CreacteOrganizationContentSection user={user} view={view} />
        </Card>
    )
}
