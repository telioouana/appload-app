import { ThemeProvider } from "@/components/providers/theme-provider"

import { EdgeStoreProvider } from "@/lib/edgestore"

export function Main({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <EdgeStoreProvider>
                {children}
            </EdgeStoreProvider>
        </ThemeProvider>
    )
}