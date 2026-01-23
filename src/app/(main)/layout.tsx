import { PropsWithChildren } from "react";

import { TRPCReactProvider } from "@/backend/trpc/client";

import { MainLayout } from "@/modules/main/ui/layout/main-layout";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <TRPCReactProvider>
            <MainLayout>
                {children}
            </MainLayout>
        </TRPCReactProvider>
    )
}
