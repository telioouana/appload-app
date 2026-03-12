import { PropsWithChildren } from "react";

import { PublicHeader } from "../components/navigation/header";
import { PublicThemeProvider } from "../../../../../../theme/theme-provider";

export function PublicUILayout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full">
            <PublicThemeProvider>
                <PublicHeader />
                <div className="w-full h-full pt-6 pb-2">
                    {children}
                </div>
            </PublicThemeProvider>
        </div>
    )
}
