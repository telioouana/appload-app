"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconLayoutGrid, IconList, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LAYOUT_VIEW } from "../../../types/types";
import { useRegisterDriver } from "../../../hooks/use-register-driver";
import { RegisterDriverDialog } from "../../../ui/components/dialog/register-driver-dialog";

export function HeaderView() {
    const [tab, setTab] = useState<LAYOUT_VIEW>("list")

    const t = useTranslations(`Carrier.company.drivers.page`)
    const { onOpenChange } = useRegisterDriver()
    const router = useRouter()

    function view(value: LAYOUT_VIEW) {
        setTab(value)

        const url = new URL(window.location.href)
        url.searchParams.set("view", value)

        router.replace(url.href)
    }

    return (
        <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <div className="flex gap-2">
                <RegisterDriverDialog />
                <Tabs className="hidden" value={tab} onValueChange={(value) => view(value as LAYOUT_VIEW)}>
                    <TabsList className="rounded-md">
                        <TabsTrigger value="grid" className="rounded-md">
                            <Tooltip>
                                <TooltipTrigger><IconLayoutGrid /></TooltipTrigger>
                                <TooltipContent>{t("buttons.grid")}</TooltipContent>
                            </Tooltip>
                        </TabsTrigger>
                        <TabsTrigger value="list" className="rounded-md">
                            <Tooltip>
                                <TooltipTrigger><IconList /></TooltipTrigger>
                                <TooltipContent>{t("buttons.list")}</TooltipContent>
                            </Tooltip>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <Button
                    className="h-11"
                    onClick={onOpenChange}
                >
                    <IconPlus />
                    {t("buttons.add")}
                </Button>
            </div>
        </div>
    )
}

