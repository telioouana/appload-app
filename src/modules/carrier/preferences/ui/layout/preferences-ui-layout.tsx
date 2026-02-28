import { PropsWithChildren } from "react";
import { PreferencesHeader } from "../navigation/header";

export function PreferencesUILayout({ children }: PropsWithChildren) {
    return (
        <div>
            <PreferencesHeader />
            <div className="max-w-5xl mx-auto w-full py-8">
                {children}
            </div>
        </div>
    )
}
