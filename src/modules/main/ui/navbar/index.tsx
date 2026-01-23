"use client"

import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { UserButton } from "@/modules/account/ui/button/user-button";

export function MainNavbar() {
    const { isMobile, state, toggleSidebar } = useSidebar()

    return (
        <header className="bg-transparent sticky top-0 z-50 flex items-center m-4 rounded-sm shadow-md backdrop-blur-md">
            <div className="flex h-(--header-height) w-full items-center gap-2 px-2 justify-between">
                <Button className="size-8" variant="outline" onClick={toggleSidebar}>
                    {(state === "collapsed" || isMobile)
                        ? <IconLayoutSidebarLeftExpand className="size-4" />
                        : <IconLayoutSidebarLeftCollapse className="size-4" />
                    }
                </Button>

                <UserButton />
            </div>
        </header>
    )
}
