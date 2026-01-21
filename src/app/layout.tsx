import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Montserrat, Playfair_Display, Source_Code_Pro } from "next/font/google";


import { Toaster } from "@/components/ui/sonner"
import { Main } from "@/components/providers/main"

import "./globals.css";

const montserrat = Montserrat({
    variable: "--font-sans",
    subsets: ["latin"],
});

const sorceCodePro = Source_Code_Pro({
    variable: "--font-mono",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-serif",
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
        <html lang={locale} className={montserrat.variable} suppressHydrationWarning>
            <body className={`${sorceCodePro.variable} ${playfair.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <Main>
                        <Toaster />
                        {children}
                    </Main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
