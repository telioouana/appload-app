"use client"

import { PropsWithChildren } from "react"

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
            <EdgeStoreProvider>
                {children}
            </EdgeStoreProvider>
        </ThemeProvider>
    )
}