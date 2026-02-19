import { PropsWithChildren } from "react";

import { AccountUILayout } from "@/modules/shipper/account/ui/layout/account-ui-layout";

export default function ShipperAccoutLayout({ children }: PropsWithChildren) {
    return (
        <AccountUILayout>
            {children}
        </AccountUILayout>
    )
}
