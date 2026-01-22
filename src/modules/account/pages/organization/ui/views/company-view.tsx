"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { authClient } from "@/backend/auth/auth-client"

import { Loader } from "@/components/customs/loader"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CompanyTab } from "@/modules/account/pages/organization/ui/types"
import { EmptyCompany } from "@/modules/account/pages/organization/ui/sections/empty-company"
import { CompanyDetails } from "@/modules/account/pages/organization/ui/sections/company-details"
import { CompanyMembers } from "@/modules/account/pages/organization/ui/sections/company-members"
import { CompanyInvitations } from "@/modules/account/pages/organization/ui/sections/company-invitations"
import { CompanyMarketplace } from "@/modules/account/pages/organization/ui/sections/company-marketplace"
import { CompanySubscriptions } from "@/modules/account/pages/organization/ui/sections/company-subscriptions"

type Props = {
    tab: CompanyTab
}

export function CompanyView({ tab }: Props) {
    const t = useTranslations("Account.organization.landing.tabs")
    const router = useRouter()

    const { data: organization, isPending } = authClient.useActiveOrganization()

    if (isPending) return <Loader />

    if (!organization) return <EmptyCompany />

    function changeTab(tab: CompanyTab) {
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tab)
        router.replace(url.href)
    }

    return (
        <div className="flex flex-col gap-y-6 w-full h-full container-snap">
            <CompanyDetails organization={organization} />

            <Card>
                <Tabs className="w-full" defaultValue={tab}>
                    <CardHeader>
                        <TabsList className="w-full">
                            <TabsTrigger onClick={() => changeTab("members")} value="members">{t("members")}</TabsTrigger>
                            <TabsTrigger onClick={() => changeTab("invitations")} value="invitations">{t("invitations")}</TabsTrigger>
                            {organization.type == "shipper" && (
                                <TabsTrigger onClick={() => changeTab("subscriptions")} value="subscriptions">{t("subscriptions")}</TabsTrigger>
                            )}
                            {organization.subscriptionPlan === "pro" || organization.type === "carrier" && (
                                <TabsTrigger onClick={() => changeTab("marketplace")} value="marketplace">{t(`marketplace.${organization.type}`)}</TabsTrigger>
                            )}
                            <TabsTrigger onClick={() => changeTab("settings")} value="settings">{t("settings")}</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent>
                        <TabsContent value="members">
                            <CompanyMembers organization={organization} />
                        </TabsContent>

                        <TabsContent value="invitations">
                            <CompanyInvitations organization={organization} />
                        </TabsContent>

                        <TabsContent value="subscriptions">
                            <CompanySubscriptions />
                        </TabsContent>

                        <TabsContent value="marketplace">
                            <CompanyMarketplace />
                        </TabsContent>
                        <TabsContent value="settings"></TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div >
    )
}