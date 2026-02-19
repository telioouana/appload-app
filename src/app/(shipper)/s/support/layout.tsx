import { PropsWithChildren } from "react";

import { SupportUILayout } from "@/modules/shipper/support/ui/layout/support-ui-layout";

export default function ShipperAccoutLayout({ children }: PropsWithChildren) {
    return (
        <SupportUILayout>
            {children}
        </SupportUILayout>
    )
}
