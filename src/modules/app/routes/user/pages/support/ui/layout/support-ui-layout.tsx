import { PropsWithChildren } from "react";
import { SupportHeader } from "../navigation/header";

export function SupportUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <SupportHeader />
            <div className="max-w-5xl mx-auto w-full py-8">
                {children}
            </div>
        </div>
    )
}
