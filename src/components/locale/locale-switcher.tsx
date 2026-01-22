import { useLocale } from "next-intl"

import { LocaleSelect } from "@/components/locale/locale-select"

import { locales } from "@/i18n/config"

export function LocaleSwitcher() {
    const locale = useLocale()

    return (
        <LocaleSelect
            defaultValue={locale}
            items={locales.map(code => ({
                flag: `/flags/${code === "en-US" ? "GB" : "PT"}.svg`,
                locale: code,
            }))}
        />
    )
}