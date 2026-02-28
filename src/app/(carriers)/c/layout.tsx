import { PropsWithChildren } from "react";

import { TRPCReactProvider } from "@/backend/trpc/client";

export default function ShipperLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full overflow-y-auto container-snap">
            <TRPCReactProvider>
                {children}
            </TRPCReactProvider>
        </div>
    )
}
