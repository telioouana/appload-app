import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Montserrat, Playfair_Display, Source_Code_Pro } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/providers/theme-provider"

import { EdgeStoreProvider } from "@/lib/edgestore"

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale()
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${montserrat.variable} ${sourceCodePro.variable} ${playfair.variable} antialiased h-screen w-screen overflow-clip`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme
                >
                    <NextIntlClientProvider messages={messages}>
                        <TooltipProvider>
                            <EdgeStoreProvider>
                                <Analytics />
                                <Toaster />
                                {children}
                            </EdgeStoreProvider>
                        </TooltipProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
