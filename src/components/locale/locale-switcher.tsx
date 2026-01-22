import { LocaleSelect } from "@/components/locale/locale-select"

import { locales } from "@/i18n/config"

export function LocaleSwitcher() {

    return (
        <LocaleSelect
            items={locales.map(code => ({
                flag: `/flags/${code === "en-US" ? "GB" : "PT"}.svg`,
                locale: code,
            }))}
        />
    )
}