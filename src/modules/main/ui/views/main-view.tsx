"use client"

import { PropsWithChildren } from "react"
import { redirect } from "next/navigation";

import { authClient } from "@/backend/auth/auth-client";

import { Loader } from "@/components/customs/loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { MainNavbar } from "@/modules/main/ui/navbar";
import { MainSidebar } from "@/modules/main/ui/sidebar";

export function MainView({ children }: PropsWithChildren) {
    const { data: session, isPending } = authClient.useSession()
    const { data: organization, isPending: isLoading } = authClient.useActiveOrganization()

    if (isPending || isLoading) return <Loader />
    if (!session) redirect("/sign-in")
    if (!organization) redirect("/company")

    return (
        <div className="[--header-height:calc(--spacing(14))] w-full h-full overflow-hidden">
            <SidebarProvider className="flex flex-col w-full h-full">
                <MainNavbar />
                <div className="flex flex-1 w-full h-full">
                    <MainSidebar type={session.user.type} />
                    <SidebarInset className="flex flex-1 flex-col h-fullw-[calc(100svh-var(--sidebar-width))] gap-4 p-4">
                        <div className="h-full w-full overflow-y-scroll container-snap">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
