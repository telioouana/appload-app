"use client"

import { Separator } from "@/components/ui/separator";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconSearch } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { MAP_FILTER } from "../../../types/types";

export function PageView() {
    const [value, setValue] = useState<string>("")
        const [tab, setTab] = useState<MAP_FILTER>("all")

    const t = useTranslations("Shipper.map.page")
    const router = useRouter()

    function search(value: string) {
        setValue(value)

        const url = new URL(window.location.href)
        if (value) {
            url.searchParams.set("search", value)
        } else {
            url.searchParams.delete("search")
        }

        router.replace(url.href)
    }

    function filter(value: MAP_FILTER) {
        setTab(value)

        const url = new URL(window.location.href)
        if (value !== "all") {
            url.searchParams.set("filterBy", value)
        } else {
            url.searchParams.delete("filterBy")
        }

        router.replace(url.href)
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
                                <IconSearch />
                            </InputGroupAddon>

                            <InputGroupInput
                                value={value}
                                onChange={(e) => search(e.target.value)}
                                placeholder={t("card.search")}
                            />
                        </InputGroup>
                    </div>

                    <Separator />

                    <FieldGroup className="w-full">
                        <Field className="gap-2">
                            <FieldLabel className="text-muted-foreground font-normal text-xs">{t("card.filters.label")}</FieldLabel>
                            <Tabs value={tab} onValueChange={(value) => filter(value as MAP_FILTER)}>
                                <TabsList className="bg-transparent -mx-2">
                                    <TabsTrigger value="all">{t("card.filters.all")}</TabsTrigger>

                                    <TabsTrigger value="loading" className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-blue-500" />
                                        <span>{t("card.filters.loading")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="moving" className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-green-500" />
                                        <span>{t("card.filters.moving")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="stopped" className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-neutral-500" />
                                        <span>{t("card.filters.stopped")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="issue" className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-red-500" />
                                        <span>{t("card.filters.issue")}</span>
                                    </TabsTrigger>

                                    <TabsTrigger value="offloading" className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-purple-500" />
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
