"use client";

import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { createContext, useContext, useEffect, useState, } from "react";

import setGlobalColorTheme from "./theme-colors";

const ThemeContext = createContext<ThemeColorStateParams>(
    {} as ThemeColorStateParams,
);

export function PrivateThemeProvider({
    children,
}: ThemeProviderProps) {
    const getSavedThemeColor = () => {
        try {
            return (localStorage.getItem("privateThemeColor") as ThemeColors) || "gray";
        } catch (error) {
            console.log(error)
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            "gray" as ThemeColors;
        }
    };

    const [themeColor, setThemeColor] = useState<ThemeColors>(
        getSavedThemeColor() as ThemeColors,
    );
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        localStorage.setItem("privateThemeColor", themeColor);
        setGlobalColorTheme(theme as "light" | "dark", themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeColor, theme]);

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
    const getSavedThemeColor = () => {
        try {
            return (localStorage.getItem("publicThemeColor") as ThemeColors) || "orange";
        } catch (error) {
            console.log(error)
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            "orange" as ThemeColors;
        }
    };

    const [themeColor, setThemeColor] = useState<ThemeColors>(
        getSavedThemeColor() as ThemeColors,
    );
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        localStorage.setItem("publicThemeColor", themeColor);
        setGlobalColorTheme(theme as "light" | "dark", themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [themeColor, theme]);

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