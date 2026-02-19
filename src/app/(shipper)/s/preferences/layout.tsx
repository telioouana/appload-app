import { PropsWithChildren } from "react";

import { PreferencesUILayout } from "@/modules/shipper/preferences/ui/layout/preferences-ui-layout";

export default function ShipperAccoutLayout({ children }: PropsWithChildren) {
    return (
        <PreferencesUILayout>
            {children}
        </PreferencesUILayout>
    )
}
