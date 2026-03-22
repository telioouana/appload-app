import { PropsWithChildren } from "react";

import { PrivateThemeProvider } from "@/theme/theme-provider";
import { PrivateHeader } from "../components/navigation/header";

export function PrivateUILayout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full">
            <PrivateThemeProvider>
                <PrivateHeader />
                <div className="w-full h-full max-w-6xl mx-auto pt-6 pb-2 px-2">
                    {children}
                </div>
            </PrivateThemeProvider>
        </div>
    )
}
