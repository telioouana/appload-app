"use client"

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IconLayoutGrid, IconList, IconPlus, IconSearch, IconLoader2 } from "@tabler/icons-react";

import { CATEGORIES } from "@/backend/db/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Field, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LAYOUT_VIEW, ORDERS_PATH } from "@/modules/app/routes/shipper/types/types";
import { useCreateOrder } from "@/modules/app/routes/shipper/hooks/use-create-order";
import { CreateOrderDialog } from "@/modules/app/routes/shipper/ui/components/dialog/create-order-dialog";

export function OrdersActionsView({ path }: { path: ORDERS_PATH }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const share = pathname.includes("private")
        ? "subscribers"
        : pathname.includes("public")
            ? "non-subscribers"
            : null

    const t = useTranslations("Shipper.marketplace.actions");
    const { onOpenChange } = useCreateOrder();

    // 1. React Transition handles the "HUNG" state by prioritizing UI over URL updates
    const [isPending, startTransition] = useTransition();

    // 2. Local States (Fast UI) initialized from URL
    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
    const [cargoValue, setCargoValue] = useState(searchParams.get("cargo-type") ?? "");
    const [tab, setTab] = useState<LAYOUT_VIEW>((searchParams.get("view") as LAYOUT_VIEW) ?? "grid");

    // 3. Debounced URL Sync Logic
    const syncUrl = useDebouncedCallback((params: { key: string; value: string | null }) => {
        const url = new URL(window.location.href);

        if (params.value && params.value !== "none") {
            url.searchParams.set(params.key, params.value);
        } else {
            url.searchParams.delete(params.key);
        }

        // startTransition prevents the browser from "hanging" during the replace
        startTransition(() => {
            router.replace(url.href, { scroll: false });
        });
    }, { wait: 400 });

    // 4. Handlers
    function handleSearch(val: string) {
        setSearchValue(val);
        syncUrl({ key: "search", value: val });
    }

    function handleCargoChange(val: string) {
        setCargoValue(val === "none" ? "" : val)
        syncUrl({ key: "cargo-type", value: val });
    }

    function handleViewChange(val: LAYOUT_VIEW) {
        setTab(val);
        const url = new URL(window.location.href);
        url.searchParams.set("view", val);
        router.replace(url.href, { scroll: false });
    }

    return (
        <Card className="h-fit">
            <CardContent className="flex flex-col gap-3 h-fit">
                <div className="flex justify-between gap-4 items-center">
                    <div className="flex flex-1 justify-between gap-4 items-center">
                        <InputGroup className="h-11">
                            <InputGroupAddon>
                                {isPending ? (
                                    <IconLoader2 className="size-4 animate-spin text-primary" />
                                ) : (
                                    <IconSearch className="size-4 text-muted-foreground" />
                                )}
                            </InputGroupAddon>

                            <InputGroupInput
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={t("search")}
                            />
                        </InputGroup>

                        <Tabs className="hidden" value={tab} onValueChange={(v) => handleViewChange(v as LAYOUT_VIEW)}>
                            <TabsList className="rounded-md">
                                <TabsTrigger value="grid" className="rounded-md">
                                    <IconLayoutGrid className="size-4" />
                                </TabsTrigger>
                                <TabsTrigger value="list" className="rounded-md">
                                    <IconList className="size-4" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {share !== null && (
                        <div>
                            <CreateOrderDialog path={path} share={share} search={searchValue} cargoType={cargoValue} />
                            <Button className="h-11" onClick={onOpenChange}>
                                <IconPlus className="mr-2 size-4" />
                                {t("button")}
                            </Button>
                        </div>
                    )}
                </div>

                <Separator />

                <FieldGroup className="w-full">
                    <FieldSet className="gap-3">
                        <FieldTitle>{t("filters.title")}</FieldTitle>
                        <Field className="gap-2">
                            <FieldLabel className="text-muted-foreground font-normal text-xs">
                                {t("filters.cargo-type.label")}
                            </FieldLabel>
                            <Select value={cargoValue} onValueChange={handleCargoChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("filters.cargo-type.placeholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t("filters.cargo-type.options.none")}</SelectItem>
                                    {CATEGORIES.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {t(`filters.cargo-type.options.${item}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </CardContent>
        </Card>
    );
}