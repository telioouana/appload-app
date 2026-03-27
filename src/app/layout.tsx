import type { Metadata } from "next";

import { headers } from "next/headers"
import { UAParser } from "ua-parser-js"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { headers } from "next/headers"
import { Montserrat, Playfair_Display, Source_Code_Pro } from "next/font/google";
import { UAParser } from "ua-parser-js"

import { SafariBlock } from "@/components/safari-block"

import "./globals.css";

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/providers/theme-provider"

import { EdgeStoreProvider } from "@/lib/edgestore"

import { SafariBlock } from "@/modules/app/ui/components/states/safari-block";

const montserrat = Montserrat({
    variable: "--font-sans",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Appload App",
    description: "Going the extra mile",
};

function isSafari(userAgent: string | null): boolean {
    if (!userAgent) return false
    const browser = new UAParser(userAgent).getBrowser()
    return browser.name === "Safari" || browser.name === "Mobile Safari"
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale()
    const messages = await getMessages()
    const headersList = await headers()
    const safari = isSafari(headersList.get("user-agent"))

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${montserrat.variable} ${sourceCodePro.variable} ${playfair.variable} antialiased h-screen w-screen overflow-clip`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    disableTransitionOnChange
                    enableColorScheme
                >
                    <NextIntlClientProvider messages={messages}>
                        {safari ? (
                            <SafariBlock />
                        ) : (
                            <TooltipProvider>
                                <EdgeStoreProvider>
                                    <Analytics />
                                    <Toaster />
                                    {children}
                                </EdgeStoreProvider>
                            </TooltipProvider>
                        )}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
