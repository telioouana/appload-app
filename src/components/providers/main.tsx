import { PropsWithChildren } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/providers/theme-provider"

import { EdgeStoreProvider } from "@/lib/edgestore"

export function Main({ children }: PropsWithChildren) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <TooltipProvider>
                <EdgeStoreProvider>
                    {children}
                </EdgeStoreProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}