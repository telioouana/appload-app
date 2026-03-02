import { PropsWithChildren } from "react";

import { PublicUILayout } from "@/modules/app/routes/shipper/ui/layout/public-ui-layout";

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full">
            <PublicUILayout>
                {children}
            </PublicUILayout>
        </div>
    )
}

