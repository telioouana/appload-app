import { PropsWithChildren } from "react";

import { PublicUILayout } from "@/modules/shipper/main/public/ui/layout/public-ui-layout";

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <PublicUILayout>
            {children}
        </PublicUILayout>
    )
}

