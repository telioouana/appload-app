"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconLayoutGrid, IconList, IconSearch } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { LAYOUT_VIEW } from "../../../types/types";

export function ClientsActionsView() {
    const [tab, setTab] = useState<LAYOUT_VIEW>("grid")
    const [value, setValue] = useState<string>("")

    const t = useTranslations("Carrier.clients.actions")
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

    function view(value: LAYOUT_VIEW) {
        setTab(value)

        const url = new URL(window.location.href)
        url.searchParams.set("view", value)

        router.replace(url.href)
    }

    return (
        <Card className="p-0">
            <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex justify-between gap-4 items-center">
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

                    <Tabs className="hidden" value={tab} onValueChange={(value) => view(value as LAYOUT_VIEW)}>
                        <TabsList className="rounded-md">
                            <TabsTrigger value="grid" className="rounded-md">
                                <Tooltip>
                                    <TooltipTrigger><IconLayoutGrid /></TooltipTrigger>
                                    <TooltipContent>{t("view.grid")}</TooltipContent>
                                </Tooltip>
                            </TabsTrigger>
                            <TabsTrigger value="list" className="rounded-md">
                                <Tooltip>
                                    <TooltipTrigger><IconList /></TooltipTrigger>
                                    <TooltipContent>{t("view.list")}</TooltipContent>
                                </Tooltip>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
