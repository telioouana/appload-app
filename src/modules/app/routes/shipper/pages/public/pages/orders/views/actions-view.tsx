"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconLayoutGrid, IconList, IconPlus, IconSearch } from "@tabler/icons-react";

import { CATEGORIES } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LAYOUT_VIEW, ORDERS_PATH } from "@/modules/app/routes/shipper/types/types";
import { useCreateOrder } from "@/modules/app/routes/shipper/hooks/use-create-order";
import { CreateOrderDialog } from "@/modules/app/routes/shipper/ui/components/dialog/create-order-dialog";

export function ActionsView({ path }: { path: ORDERS_PATH }) {
    const [cargo, setCargo] = useState<typeof CATEGORIES[number] | "none" | "">("")
    const [tab, setTab] = useState<LAYOUT_VIEW>("grid")
    const [value, setValue] = useState<string>("")

    const t = useTranslations(`Shipper.public.marketplace.actions`)
    const { onOpenChange } = useCreateOrder()
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

    function filterCargo(value: typeof CATEGORIES[number] | "none") {
        setCargo(value === "none" ? "" : value)

        const url = new URL(window.location.href)
        if (value !== "none") {
            url.searchParams.set("cargo-type", value)
        } else {
            url.searchParams.delete("cargo-type")
        }

        router.replace(url.href)
    }

    return (
        <Card>
            <CardContent className="flex flex-col gap-3 h-full">
                <div className="flex justify-between gap-4 items-center">
                    <div className="flex flex-1 justify-between gap-4 items-center">
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

                    <div>
                        <CreateOrderDialog path={path} share="non-subscribers" />
                        <Button
                            className="h-11"
                            onClick={onOpenChange}
                        >
                            <IconPlus />
                            {t("button")}
                        </Button>
                    </div>
                </div>

                <Separator />

                <FieldGroup className="w-full">
                    <FieldSet className="gap-3">
                        <FieldTitle>{t("filters.title")}</FieldTitle>
                        <Field className="gap-2">
                            <FieldLabel className="text-muted-foreground font-normal text-xs">{t("filters.cargo-type.label")}</FieldLabel>
                            <Select
                                value={cargo}
                                onValueChange={(value) => filterCargo(value as typeof CATEGORIES[number] | "none")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("filters.cargo-type.placeholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((item) => <SelectItem key={item} value={item}>{t(`filters.cargo-type.options.${item}`)}</SelectItem>)}
                                    <SelectItem value="none">{t("filters.cargo-type.options.none")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="gap-2">
                            <FieldLabel className="text-muted-foreground font-normal text-xs">{t("filters.status.label")}</FieldLabel>

                        </Field>
                    </FieldSet>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
