import { PropsWithChildren } from "react";

import { AccountLayout } from "@/modules/account/ui/layout/account-layout";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <AccountLayout>
            {children}
        </AccountLayout>
    )
}
