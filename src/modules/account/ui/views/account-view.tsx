import { PropsWithChildren } from "react";

import { AccountSidebar } from "@/modules/account/ui/sidebar";
import { EmailVerification } from "@/modules/account/ui/section/email-verifications";

export function AccountView({ children }: PropsWithChildren) {
    return (
        <div className="flex gap-8 [--header-height:calc(--spacing(14))] h-full w-full max-w-540 mx-auto overflow-hidden">
            <AccountSidebar />
            <div className="w-full h-full max-w-270 mx-auto pt-2">
                <div className="h-full w-[calc(100svh-var(--sidebar--width))] flex flex-1 flex-col gap-y-6 px-4 overflow-y-scroll container-snap">
                    <EmailVerification />
                    {children}
                    <div />
                </div>
            </div>
        </div>
    )
}
