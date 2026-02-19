import { PropsWithChildren } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ShipperSidebar } from "../navigation/sidebar";

export function ShipperUILayout({ children }: PropsWithChildren) {
    return (
        <main className="h-full w-full">
            <SidebarProvider>
                <ShipperSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}
