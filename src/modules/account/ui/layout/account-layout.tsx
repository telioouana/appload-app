import { PropsWithChildren } from "react";

import { AccountNavbar } from "@/modules/account/ui/navbar";
import { AccountView } from "@/modules/account/ui/views/account-view";

export function AccountLayout({ children }: PropsWithChildren) {
    return (
        <main className="h-screen w-screen flex flex-col">
            <AccountNavbar />

            <AccountView>
                {children}
            </AccountView>
        </main>
    );
}