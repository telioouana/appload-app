import { PropsWithChildren } from "react";
import { PrivateHeader } from "../navigation/header";

export function PrivateUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <PrivateHeader />
            <div className="w-full h-full max-w-6xl mx-auto py-6 px-1">
                {children}
            </div>
        </div>
    )
}
