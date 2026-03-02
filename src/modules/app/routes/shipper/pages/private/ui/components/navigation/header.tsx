"use client"

import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

import { authClient } from "@/backend/auth/auth-client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerator } from "@/components/customs/avatar";
import { Header } from "@/modules/app/ui/components/navigation/header";


export function PrivateHeader() {
    const { isMobile, state, toggleSidebar } = useSidebar()
    const { isPending, data } = authClient.useActiveOrganization()

    if (isPending || !data) {
        return (
            <header className="bg-background sticky top-0 z-50 p-2">
                <nav className="bg-sidebar flex items-center rounded-lg border border-sidebar-border shadow-sm">
                    <div className="flex h-(--header-height) w-full items-center gap-2 p-2 justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-9" />
                            <Skeleton className="h-9 w-36" />
                        </div>

                        <Header />
                    </div>
                </nav>
            </header>
        )
    }

    const { name, logo } = data

    function avatar(className?: string) {
        if (logo) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={logo} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    return (
        <header className="bg-background sticky top-0 z-50 p-2">
            <nav className="bg-sidebar flex items-center rounded-lg border border-sidebar-border shadow-sm">
                <div className="flex h-(--header-height) w-full items-center gap-2 p-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={toggleSidebar}>
                            {(state === "collapsed" || isMobile)
                                ? <IconLayoutSidebarLeftExpand className="size-4" />
                                : <IconLayoutSidebarLeftCollapse className="size-4" />
                            }
                        </Button>

                        <Button>
                            {avatar("size-4")}
                            {name}
                        </Button>
                    </div>

                    <Header />
                </div>
            </nav>
        </header>
    )
}
