import { PropsWithChildren } from "react";
import { PublicHeader } from "../navigation/header";

export function PublicUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <PublicHeader />
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    )
}
