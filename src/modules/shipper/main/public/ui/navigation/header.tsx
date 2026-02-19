"use client"

import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { Header } from "../../../ui/navigation/header";

export function PublicHeader() {
    const { isMobile, state, toggleSidebar } = useSidebar()

    return (
        <header className="bg-background sticky top-0 z-50 p-2">
            <nav className="bg-sidebar flex items-center rounded-lg border border-sidebar-border shadow-sm">
                <div className="flex h-(--header-height) w-full items-center gap-2 p-2 justify-between">
                    <div className="flex items-center gap-8">
                        <Button size="icon" variant="outline" onClick={toggleSidebar}>
                            {(state === "collapsed" || isMobile)
                                ? <IconLayoutSidebarLeftExpand className="size-4" />
                                : <IconLayoutSidebarLeftCollapse className="size-4" />
                            }
                        </Button>
                    </div>

                    <Header />
                </div>
            </nav>
        </header>
    )
}
