"use client"

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconLayoutGrid, IconList, IconPlus } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client"

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { LAYOUT_VIEW } from "../../../types/types";
import { useRegisterFleet } from "../../../hooks/use-register-fleet";
import { RegisterFleetDialog } from "../../../ui/components/dialog/register-fleet-dialog";

export function HeaderView() {
    const [tab, setTab] = useState<LAYOUT_VIEW>("list")

    const t = useTranslations(`Carrier.company.fleet.page`)
    const { onOpenChange } = useRegisterFleet()
    const router = useRouter()
    const trpc = useTRPC()

    function view(value: LAYOUT_VIEW) {
        setTab(value)

        const url = new URL(window.location.href)
        url.searchParams.set("view", value)

        router.replace(url.href)
    }

    const {
        data: drivers
    } = useSuspenseQuery(
        trpc.driver.offer.queryOptions()
    )

    return (
        <Suspense fallback={"...Loading"}>
            <ErrorBoundary fallback={"...Error loading"}>
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                        <p className="text-muted-foreground">{t("description")}</p>
                    </div>

                    <div className="flex gap-2">
                        <RegisterFleetDialog />
                        <Tabs value={tab} onValueChange={(value) => view(value as LAYOUT_VIEW)}>
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
                            onClick={() => onOpenChange(drivers)}
                        >
                            <IconPlus />
                            {t("buttons.add")}
                        </Button>
                    </div>
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
