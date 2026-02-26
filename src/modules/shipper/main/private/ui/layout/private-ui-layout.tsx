import { PropsWithChildren } from "react";
import { PrivateHeader } from "../navigation/header";
import { PrivateThemeProvider } from "../../../ui/theme/theme-provider";

export function PrivateUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <PrivateThemeProvider>
                <PrivateHeader />
                <div className="w-full h-full max-w-6xl mx-auto pt-6 pb-2 px-1">
                    {children}
                </div>
            </PrivateThemeProvider>
        </div>
    )
}
