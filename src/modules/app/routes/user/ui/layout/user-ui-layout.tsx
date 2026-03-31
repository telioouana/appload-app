import { PropsWithChildren } from "react";

import { LocaleSwitcher } from "@/components/locale/locale-switcher"
import { ThemeToggle } from "@/modules/app/ui/components/button/theme-toggle"

export function UserUILayout({ children }: PropsWithChildren) {
    return (
        <div className="h-full w-full overflow-y-auto container-snap">
            <div className="absolute top-4 right-4 z-50">
                <div className="flex gap-2">
                    <ThemeToggle />
                    <LocaleSwitcher />
                </div>
            </div>
            {children}
        </div>
    )
}
