import { PropsWithChildren } from "react";

import { CarrierUILayout } from "@/modules/carrier/main/ui/layout/carrier-layout";

export default function ShipperMainLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full">
            <CarrierUILayout>
                {children}
            </CarrierUILayout>
        </div>
    )
}
