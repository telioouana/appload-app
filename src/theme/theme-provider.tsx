"use client";

import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { createContext, useContext, useEffect, useState, } from "react";

import setGlobalColorTheme from "./theme-colors";
import { ThemeColors, ThemeColorStateParams } from "./theme-types";

const ThemeContext = createContext<ThemeColorStateParams>(
    {} as ThemeColorStateParams,
);

export function PrivateThemeProvider({
    children,
}: ThemeProviderProps) {
    const [themeColor, setThemeColor] = useState<ThemeColors>("amber");

    useEffect(() => {
        const savedColor = localStorage.getItem("privateThemeColor") as ThemeColors;
        if (savedColor && savedColor !== "gray") {
            setThemeColor(savedColor);
        }
    }, []);

    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
        localStorage.setItem("privateThemeColor", themeColor);
        setGlobalColorTheme(resolvedTheme, themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeColor, resolvedTheme]);

    if (!isMounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function PublicThemeProvider({
    children,
}: ThemeProviderProps) {
    const [themeColor, setThemeColor] = useState<ThemeColors>("orange");

    useEffect(() => {
        const savedColor = localStorage.getItem("publicThemeColor") as ThemeColors;
        if (savedColor) {
            setThemeColor(savedColor);
        }
    }, []);

    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    
    useEffect(() => {
        if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
        localStorage.setItem("publicThemeColor", themeColor);
        setGlobalColorTheme(resolvedTheme, themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeColor, resolvedTheme]);

    if (!isMounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);

}