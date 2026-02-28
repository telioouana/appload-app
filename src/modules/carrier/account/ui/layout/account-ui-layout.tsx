import { PropsWithChildren } from "react";
import { AccountHeader } from "../navigation/header";

export function AccountUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <AccountHeader />
            <div className="max-w-5xl mx-auto w-full py-8">
                {children}
            </div>
        </div>
    )
}
