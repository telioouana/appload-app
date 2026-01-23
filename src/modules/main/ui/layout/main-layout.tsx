import { PropsWithChildren } from "react";

import { MainView } from "@/modules/main/ui/views/main-view";

export async function MainLayout({ children }: PropsWithChildren) {
    return (
        <main className="h-screen w-screen">
            <MainView>
                {children}
            </MainView>
        </main>
    )
}
