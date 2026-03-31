"use client";

import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { createContext, useContext, useEffect, useState, useMemo } from "react";

import { setGlobalColorTheme } from "./theme-colors";
import { ThemeColors, ThemeColorStateParams } from "./theme-types";

// --- 1. SAFE UTILITY (Use this anywhere, even outside Providers) ---
export const getSafePrivateColor = (): ThemeColors => {
    if (typeof window === "undefined") return "amber";
    const saved = localStorage.getItem("privateThemeColor") as ThemeColors;
    return (saved) ? (saved as ThemeColors) : "amber";
};

const PrivateThemeContext = createContext<ThemeColorStateParams | undefined>(undefined);
const PublicThemeContext = createContext<ThemeColorStateParams | undefined>(undefined);

// --- 2. PRIVATE PROVIDER ---
export function PrivateThemeProvider({ children }: ThemeProviderProps) {
    // Lazy initializer handles the initial load without an Effect
    const [themeColor, setThemeColor] = useState<ThemeColors>(getSafePrivateColor);
    const { resolvedTheme } = useTheme();

    // Use Effect ONLY for synchronizing React state to the DOM/LocalStorage
    useEffect(() => {
        if (!resolvedTheme) return;
        localStorage.setItem("privateThemeColor", themeColor);
        setGlobalColorTheme(resolvedTheme as "light" | "dark", themeColor);
    }, [themeColor, resolvedTheme]);

    const value = useMemo(() => ({ themeColor, setThemeColor }), [themeColor]);

    return (
        <PrivateThemeContext.Provider value={value}>
            {children}
        </PrivateThemeContext.Provider>
    );
}

// --- 3. PUBLIC PROVIDER (Always Orange) ---
export function PublicThemeProvider({ children }: ThemeProviderProps) {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme === "light" || resolvedTheme === "dark") {
            setGlobalColorTheme(resolvedTheme, "orange");
        }
    }, [resolvedTheme]);

    const value = useMemo(() => ({
        themeColor: "orange" as ThemeColors,
        setThemeColor: () => { }
    }), []);

    return (
        <PublicThemeContext.Provider value={value}>
            {children}
        </PublicThemeContext.Provider>
    );
}

// --- 4. HOOKS ---
export function usePrivateTheme() {
    const context = useContext(PrivateThemeContext);
    // We don't throw an error here so it can be used more flexibly, 
    // but we return the context which might be undefined.
    return context;
}

export function usePublicTheme() {
    const context = useContext(PublicThemeContext);
    return context;
}