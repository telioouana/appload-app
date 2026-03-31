import { PropsWithChildren } from "react";

import { UserUILayout } from "@/modules/app/routes/user/ui/layout/user-ui-layout";

export default function ShipperLayout({ children }: PropsWithChildren) {
    return (
        <UserUILayout>
            {children}
        </UserUILayout>
    )
}
