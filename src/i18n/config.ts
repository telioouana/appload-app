export const locales = ["pt-PT", "en-US"] as const
export type Locale = (typeof locales)[number]

function getBrowserLocale(options = {}): Locale {
    const defaultOptions = {
        languageCodeOnly: false,
    };

    const opt = {
        ...defaultOptions,
        ...options,
    };

    if (typeof navigator === "undefined") {
        return "pt-PT";
    }
    
    const browserLocale = navigator.languages === undefined
        ? navigator.language as Locale
        : navigator.languages[0] as Locale;

    const language: Locale = opt.languageCodeOnly
        ? browserLocale.split(/-|_/)[0] as Locale
        : browserLocale as Locale

    return locales.includes(language) ? language : "en-US"
}

export const defaultLocale: Locale = getBrowserLocale({ languageCodeOnly: true })