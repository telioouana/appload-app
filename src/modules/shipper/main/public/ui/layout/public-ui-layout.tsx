import { PropsWithChildren } from "react";
import { PublicHeader } from "../navigation/header";
import { PublicThemeProvider } from "../../../ui/theme/theme-provider";

export function PublicUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <PublicThemeProvider>
                <PublicHeader />
                <div className="w-full h-full">
                    {children}
                </div>
            </PublicThemeProvider>
        </div>
    )
}
