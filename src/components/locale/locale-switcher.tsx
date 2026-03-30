import { locales } from "@/i18n/config"
import { Language } from "@/components/locale/language"

export function LocaleSwitcher() {

    return (
        <Language
            items={locales.map(code => ({
                flag: `/flags/${code === "en-US" ? "GB" : "PT"}.svg`,
                locale: code,
            }))}
        />
    )
}