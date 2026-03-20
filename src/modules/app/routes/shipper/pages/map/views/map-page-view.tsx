"use client"

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { MAP_FILTER } from "../../../types/types";

export function MapPageView() {
    const t = useTranslations("Shipper.map.page")
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [value, setValue] = useState<string>(searchParams.get("search") ?? "")
    const [tab, setTab] = useState<MAP_FILTER>((searchParams.get("filterBy") as MAP_FILTER) ?? "all")

    const syncUrl = useDebouncedCallback((params: { key: string; value: string | null }) => {
        const url = new URL(window.location.href)

        if (params.value && params.value !== "all") {
            url.searchParams.set(params.key, params.value)
        } else {
            url.searchParams.delete(params.key)
        }

        startTransition(() => {
            router.replace(url.href, { scroll: false })
        })
    }, { wait: 400 })

    function handleSearchChange(val: string) {
        setValue(val)
        syncUrl({ key: "search", value: val })
    }

    function handleFilterChange(val: MAP_FILTER) {
        setTab(val)
        syncUrl({ key: "filterBy", value: val })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <Card>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex justify-between gap-4 items-center">
                        <InputGroup className="h-11">
                            <InputGroupAddon>
                                {isPending ? (
                                    <IconLoader2 className="size-4 animate-spin text-primary" />
                                ) : (
                                    <IconSearch className="size-4 text-muted-foreground" />
                                )}
                            </InputGroupAddon>

                            <InputGroupInput
                                value={value}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={t("card.search")}
                            />
                        </InputGroup>
                    </div>

                    <Separator />

                    <FieldGroup className="w-full">
                        <Field className="gap-2">
                            <FieldLabel className="text-muted-foreground font-normal text-xs">
                                {t("card.filters.label")}
                            </FieldLabel>

                            <Tabs value={tab} onValueChange={(v) => handleFilterChange(v as MAP_FILTER)}>
                                <TabsList className="bg-transparent -mx-2 h-auto flex-wrap justify-start gap-1">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-muted">
                                        {t("card.filters.all")}
                                    </TabsTrigger>

                                    <TabsTrigger value="loading" className="flex items-center gap-2 data-[state=active]:bg-muted">
                                        <div className="size-2.5 rounded-full bg-blue-500" />
                                        <span>{t("card.filters.loading")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="moving" className="flex items-center gap-2 data-[state=active]:bg-muted">
                                        <div className="size-2.5 rounded-full bg-green-500" />
                                        <span>{t("card.filters.moving")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="stopped" className="flex items-center gap-2 data-[state=active]:bg-muted">
                                        <div className="size-2.5 rounded-full bg-neutral-500" />
                                        <span>{t("card.filters.stopped")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="issue" className="flex items-center gap-2 data-[state=active]:bg-muted">
                                        <div className="size-2.5 rounded-full bg-red-500" />
                                        <span>{t("card.filters.issue")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="offloading" className="flex items-center gap-2 data-[state=active]:bg-muted">
                                        <div className="size-2.5 rounded-full bg-purple-500" />
                                        <span>{t("card.filters.offloading")}</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
        </div>
    )
}