import { PropsWithChildren } from "react";

import { ShipperUILayout } from "@/modules/shipper/main/ui/layout/shipper-layout";

export default function ShipperMainLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full">
            <ShipperUILayout>
                {children}
            </ShipperUILayout>
        </div>
    )
}
