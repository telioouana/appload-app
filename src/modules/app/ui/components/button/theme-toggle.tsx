"use client"

import { Button } from "@/components/ui/button";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="h-9 w-9"
        >
            {isDark ? <IconSun className="size-4" /> : <IconMoon className="size-4" />}
        </Button>
    );
}
