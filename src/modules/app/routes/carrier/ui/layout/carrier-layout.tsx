import { PropsWithChildren } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { CarrierHeader } from "../components/navigation/header";
import { CarrierSidebar } from "../components/navigation/sidebar";

export function CarrierUILayout({ children }: PropsWithChildren) {
    return (
        <main className="h-full w-full">
            <SidebarProvider>
                <CarrierSidebar />
                <SidebarInset>
                    <CarrierHeader />
                    <div className="w-full h-full max-w-6xl mx-auto pt-6 pb-2 px-2">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}
