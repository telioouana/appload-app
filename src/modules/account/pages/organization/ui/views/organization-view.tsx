"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { authClient } from "@/backend/auth/auth-client"

import { Loader } from "@/components/customs/loader"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CompanyTab } from "@/modules/account/pages/organization/ui/types"
import { EmptyOrganization } from "@/modules/account/pages/organization/ui/sections/empty-organization"
import { OrganizationDetails } from "@/modules/account/pages/organization/ui/sections/organization-details"
import { OrganizationMembers } from "@/modules/account/pages/organization/ui/sections/organization-members"
import { OrganizationInvitations } from "@/modules/account/pages/organization/ui/sections/organization-invitations"
import { OrganizationMarketplace } from "@/modules/account/pages/organization/ui/sections/organization-marketplace"
import { OrganizationSubscriptions } from "@/modules/account/pages/organization/ui/sections/organization-subscriptions"

type Props = {
    tab: CompanyTab
}

export function OrganizationView({ tab }: Props) {
    const t = useTranslations("Account.organization.landing.tabs")
    const router = useRouter()

    const { data: organization, isPending } = authClient.useActiveOrganization()

    if (isPending) return <Loader />

    if (!organization) return <EmptyOrganization />

    function changeTab(tab: string) {
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tab)
        router.replace(url.href)
    }

    return (
        <div className="flex flex-col gap-y-6 w-full h-full container-snap">
            <OrganizationDetails organization={organization} />

            <Card>
                <Tabs className="w-full" value={tab} onValueChange={changeTab}>
                    <CardHeader>
                        <TabsList className="w-full">
                            <TabsTrigger value="members">{t("members")}</TabsTrigger>
                            <TabsTrigger value="invitations">{t("invitations")}</TabsTrigger>
                            {organization.type == "shipper" && (
                                <TabsTrigger value="subscriptions">{t("subscriptions")}</TabsTrigger>
                            )}
                            {(organization.subscriptionPlan === "pro" || organization.type === "carrier") && (
                                <TabsTrigger value="marketplace">{t(`marketplace.${organization.type}`)}</TabsTrigger>
                            )}
                            <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent>
                        <TabsContent value="members">
                            <OrganizationMembers organization={organization} />
                        </TabsContent>

                        <TabsContent value="invitations">
                            <OrganizationInvitations organization={organization} />
                        </TabsContent>

                        <TabsContent value="subscriptions">
                            <OrganizationSubscriptions />
                        </TabsContent>

                        <TabsContent value="marketplace">
                            <OrganizationMarketplace />
                        </TabsContent>
                        <TabsContent value="settings"></TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div >
    )
}