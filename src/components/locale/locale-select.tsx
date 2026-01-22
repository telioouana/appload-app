"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"


import { cn } from "@/lib/utils"
import { Locale } from "@/i18n/config"
import { setUserLocale } from "@/i18n/locale"

import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    defaultValue: string
    items: Array<{ flag: string, locale: string }>
}

export function LocaleSelect({
    defaultValue,
    items
}: Props) {
    const [isPending, startTransition] = useTransition()
    const [locale, setLocale] = useState(defaultValue)

    const t = useTranslations("Languages")

    function onChange(value: string) {
        startTransition(async () => {
            await setUserLocale(value as Locale)
        })
        setLocale(value)
    }

    return (
        <Select defaultValue={defaultValue} onValueChange={onChange}>
            <SelectTrigger
                className={cn(buttonVariants({ variant: "outline" }), "flex rounded-md shadow-md border-none bg-background")}
                disabled={isPending}
            >
                <SelectValue >
                    <div className="flex items-center justify-start gap-2">
                        <Image src={`/flags/${locale === "en-US" ? "GB" : "PT"}.svg`} alt="flag" width={16} height={16} className="size-4" />
                        <span className=" text-sm">{t(locale)}</span>
                    </div>
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
                        disabled={item.locale === defaultValue}
                    >
                        <Image src={item.flag} alt="flag" width={16} height={16} className="size-4" />
                        <span className="text-sm">{t(item.locale)}</span>
                    </SelectItem>
                ))}

            </SelectContent>
        </Select>
    )
}