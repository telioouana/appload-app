import Link from "next/link"

import { Button } from "@/components/ui/button"

export function SafariBlock() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center antialiased font-sans text-foreground">
            <div className="flex w-full max-w-3xl mx-auto flex-col items-center gap-8">
                {/* Logo */}
                <div className="shrink-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted shadow-sm">
                    <img src="/logos/appload.svg" alt="Appload" className="h-12 w-auto object-contain" />
                </div>

                {/* Headline (centered on mobile, left-aligned on md+) */}
                <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        Coming Soon
                    </span>
                    <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Safari support is on its way
                    </h1>
                    <p className="max-w-sm text-base text-muted-foreground">
                        We&apos;re working hard to bring Appload to Safari. In the
                        meantime, use Chrome for the full experience.
                    </p>
                </div>
            </div>

        </div>
    )
}
