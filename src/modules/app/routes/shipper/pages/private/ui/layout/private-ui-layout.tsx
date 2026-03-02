import { PropsWithChildren } from "react";

import { PrivateHeader } from "../components/navigation/header";
import { PrivateThemeProvider } from "../../../../ui/theme/theme-provider";

export function PrivateUILayout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full">
            <PrivateThemeProvider>
                <PrivateHeader />
                <div className="w-full max-w-6xl mx-auto pt-6 pb-2 px-2">
                    {children}
                </div>
            </PrivateThemeProvider>
        </div>
    )
}
