"use client"

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { IconLanguage } from "@tabler/icons-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { setUserLocale } from "@/i18n/locale";
import { defaultLocale, Locale } from "@/i18n/config";

import { cn } from "@/lib/utils";

export function Language({ items }: { items: Array<{ flag: string, locale: string }> }) {
    const currentLocale = useLocale() as Locale
    
    const [isPending, startTransition] = useTransition()
    const [locale, setLocale] = useState<"pt-PT" | "en-US">(currentLocale)

    const t = useTranslations("Languages")

    function onChange(value: Locale) {
        startTransition(async () => {
            await setUserLocale(value as Locale)
        })
        setLocale(value)
    }

    return (
        <Select defaultValue={defaultLocale} onValueChange={onChange}>
            <SelectTrigger
                className={cn("flex rounded-md shadow-md border bg-muted")}
                disabled={isPending}
            >
                <SelectValue >
                    <IconLanguage />
                </SelectValue>
            </SelectTrigger>
            <SelectContent
                align="end"
                className="z-50 overflow-hidden rounded-md shadow-md bg-background"
                position="popper"
            >
                {items.map((item) => (
                    <SelectItem
                        key={item.locale}
                        className="flex cursor-pointer items-center text-base ring-0 ring-offset-0 rounded-sm"
                        value={item.locale}
                        disabled={item.locale === locale}
                    >
                        <Image src={item.flag} alt="flag" width={16} height={16} className="size-4" />
                        <span className="text-sm">{t(item.locale)}</span>
                    </SelectItem>
                ))}

            </SelectContent>
        </Select>
    )
}
