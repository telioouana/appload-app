"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconSearch } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { STATUS_FILTER } from "../../../types/types";

export function ActionsView({ initialSearch }: { initialSearch?: string }) {
    const [tab, setTab] = useState<STATUS_FILTER>("all")
    const [value, setValue] = useState<string>(initialSearch ?? "")

    const t = useTranslations(`Carrier.company.drivers.actions`)
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

    function status(value: STATUS_FILTER) {
        setTab(value)

        const url = new URL(window.location.href)
        if (value !== "all") {
            url.searchParams.set("status", value)
        } else {
            url.searchParams.delete("status")
        }

        router.replace(url.href)
    }

    return (
        <Card className="p-0">
            <CardContent className="flex justify-between gap-4 items-center p-4">
                <InputGroup className="h-11">
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>

                    <InputGroupInput
                        value={value}
                        onChange={(e) => search(e.target.value)}
                        placeholder={t("search")}
                    />
                </InputGroup>

                <Tabs className="hidden" value={tab} onValueChange={(value) => status(value as STATUS_FILTER)}>
                    <TabsList>
                        <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
                        <TabsTrigger value="active">{t("tabs.active")}</TabsTrigger>
                        <TabsTrigger value="idle">{t("tabs.idle")}</TabsTrigger>
                        <TabsTrigger value="free">{t("tabs.free")}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardContent>
        </Card>
    )
}
 