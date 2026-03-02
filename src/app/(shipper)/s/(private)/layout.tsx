import { PropsWithChildren } from "react";

import { PrivateUILayout } from "@/modules/app/routes/shipper/pages/private/ui/layout/private-ui-layout";

export default function PrivateLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full">
            <PrivateUILayout>
                {children}
            </PrivateUILayout>
        </div>
    )
}
