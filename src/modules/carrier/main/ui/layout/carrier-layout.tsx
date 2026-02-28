import { PropsWithChildren } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { CarrierSidebar } from "../navigation/sidebar";

export function CarrierUILayout({ children }: PropsWithChildren) {
    return (
        <main className="h-full w-full">
            <SidebarProvider>
                <CarrierSidebar />
                <SidebarInset>
                    <div className="w-full h-full">

                    {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}
