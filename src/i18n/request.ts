import { getRequestConfig } from "next-intl/server"

import { getUserLocale } from "@/i18n/locale"
import { Locale, locales } from "@/i18n/config"

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = await getUserLocale() as Locale
    
    // Validate that the locale is supported
    const supportedLocale = locales.includes(locale) ? locale : "en-US"

    return {
        locale: supportedLocale,
        messages: (await import(`../../messages/${supportedLocale}.json`)).default
    };
})