import { PropsWithChildren } from "react";

import { TRPCReactProvider } from "@/backend/trpc/client";

import { PublicThemeProvider } from "@/theme/theme-provider";

import { AccountHeader } from "@/modules/app/routes/user/ui/components/navigation/account-header";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full">
            <TRPCReactProvider>
                <PublicThemeProvider>
                    <AccountHeader user="s" />
                    <div className="max-w-5xl mx-auto w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 h-full">
                        {children}
                    </div>
                </PublicThemeProvider>
            </TRPCReactProvider>
        </div>
    )
}
