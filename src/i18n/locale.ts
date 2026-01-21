"use server"

import { cookies } from "next/headers"
import { Locale, defaultLocale, locales } from "@/i18n/config"
// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE"

export async function getUserLocale() {
    return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale
}

export async function setUserLocale(locale: Locale) {
    // Validate that the locale is supported
    if (!locales.includes(locale)) {
         throw new Error(`Unsupported locale: ${locale}`)
     }
    (await cookies()).set(COOKIE_NAME, locale)
}