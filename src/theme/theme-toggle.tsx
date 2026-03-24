"use client"

import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            size="icon"
            variant="outline"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="size-9"
        >
            {isDark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
        </Button>
    );
}
