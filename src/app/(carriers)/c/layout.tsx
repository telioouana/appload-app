import { PropsWithChildren } from "react";

import { TRPCReactProvider } from "@/backend/trpc/client";
import { CarrierUILayout } from "@/modules/app/routes/carrier/ui/layout/carrier-layout";

export default function CarrierLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full overflow-y-auto container-snap">
            <TRPCReactProvider>
                <div className="h-full w-full">
                    <CarrierUILayout>
                        {children}
                    </CarrierUILayout>
                </div>
            </TRPCReactProvider>
        </div>
    )
}
