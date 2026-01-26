"use client"

import { z } from "zod";
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconDots, IconPlus, IconDeviceFloppy, IconSend } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";
import { CATEGORIES, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { FilterByType, FilterType } from "@/modules/main/ui/types";
import { useCreateOrder } from "@/modules/main/pages/order/hooks/use-create-order";
import { OrderForm } from "@/modules/main/pages/order/ui/forms/order-form";

type Props = {
    filter?: FilterType
    filterBy?: FilterByType
}

export function CreateOrderDialog({ filter, filterBy }: Props) {
    const { isOpen, onClose, onOpenChange } = useCreateOrder()
    const t = useTranslations("Main.order.create")
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const CreateOrderSchema = z.object({
        loadingAddress: z.array(z.object({
            address: z.string({ error: t("form.loading-address.error") }),
            placeId: z.string(),
            country: z.string(),
            state: z.string()
        })),
        expectedLoadingDate: z.date({ error: t("form.expected-loading-date.error") }),
        offloadingAddress: z.array(z.object({
            address: z.string({ error: t("form.offloading-address.error") }),
            placeId: z.string(),
            country: z.string(),
            state: z.string(),
        })),
        expectedOffloadingDate: z.date({ error: t("form.expected-offloading-date.error") }),

        expectedTrucks: z.number(),

        cargo: z.object({
            category: z.enum(CATEGORIES, { error: t("form.cargo.category.error") }),
            description: z.string({ error: t("form.cargo.description.error") }),
            quantity: z.number({ error: t("form.cargo.quantity.error") }),
            unit: z.enum(WEIGHT_UNIT, { error: t("form.cargo.unit.error") }),
            packing: z.enum(PACKING, { error: t("form.cargo.packing.error") }),
            isHazardous: z.boolean(),
            hazchemCode: z.string().optional(),
            isRefrigerated: z.boolean(),
            temperature: z.number(),
            temperatureInstructions: z.string().optional(),
            isGroupageAllowed: z.boolean(),
        })
            .refine((data) => data.isHazardous, {
                error: t("form.cargo.hazchem-code.error"),
                path: ["form.cargo.hazchem-code"]
            })
            .refine((data) => data.isRefrigerated, {
                error: t("form.cargo.temperature.error"),
                path: ["form.cargo.temperature"]
            }),

        share: z.enum(SHARE, { error: t("form.share.error") })
    })

    type CreateOrderForm = z.infer<typeof CreateOrderSchema>

    const form = useForm<CreateOrderForm>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            expectedTrucks: 1,
            cargo: {
                isHazardous: false,
                hazchemCode: "",
                isRefrigerated: false,
                temperature: 0,
                temperatureInstructions: "",
                isGroupageAllowed: false
            },
            share: "non-subscribers"
        }
    })

    const save = useMutation(
        trpc.order.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.orders.all.queryOptions({
                    filter,
                    filterBy,
                    limit: 8,
                }))
                onClose()
            },
            onError: () => { }
        }),
    )

    async function handleSave(values: CreateOrderForm) {
        await save.mutateAsync({
            status: "drafted",
            values
        })
    }

    const create = useMutation(
        trpc.order.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.orders.all.queryOptions({
                    filter,
                    filterBy,
                    limit: 8,
                }))
                onClose()
            },
            onError: () => { }
        }),
    )

    async function handleSubmit(values: CreateOrderForm, status: "prospect" | "drafted" | "pending") {
        form.clearErrors()
        const fields: FieldPath<CreateOrderForm>[] = ["loadingAddress", "expectedLoadingDate", "offloadingAddress", "expectedOffloadingDate", "expectedTrucks", "cargo.category", "cargo.description", "cargo.quantity", "cargo.unit", "cargo.packing", "share"]

        if (values.cargo.isHazardous) {
            fields.concat("cargo.hazchemCode")
        }

        if (values.cargo.isRefrigerated) {
            fields.concat("cargo.temperature")
        }

        const output = await form.trigger(fields, { shouldFocus: true })
        if (!output) return

        await create.mutateAsync({
            status,
            values
        })
    }

    return (
        <>
            <Button
                type="button"
                onClick={onOpenChange}
            >
                {t("button.create")}
                <IconPlus />
            </Button>

            <ResponsiveDialog
                title={"Publish new order"}
                description={""}
                onClose={onClose}
                open={isOpen}
                type="dialog"
                className="md:max-w-5xl"
            >
                <FormProvider {...form}>
                    <form className="flex flex-col gap-6" >
                        <OrderForm isPending={create.isPending} />

                        <div className="flex justify-between items-center gap-4">
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                    form.reset()
                                    onClose()
                                }}
                                disabled={save.isPending || create.isPending}
                            >{t("button.cancel")}</Button>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={save.isPending || create.isPending}
                                    onClick={() => handleSave(form.getValues())}
                                >
                                    {t("button.save")}
                                    {save.isPending ? <Spinner /> : <IconDeviceFloppy />}
                                </Button>

                                <ButtonGroup aria-disabled={save.isPending || create.isPending}>
                                    <Button
                                        type="button"
                                        disabled={save.isPending || create.isPending}
                                        onClick={() => handleSubmit(form.getValues(), "pending")}
                                    >
                                        {t("button.publish")}
                                        {create.isPending ? <Spinner /> : <IconSend />}
                                    </Button>
                                    <ButtonGroupSeparator />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" size="icon" disabled={save.isPending || create.isPending} ><IconDots /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    disabled={create.isPending}
                                                    onClick={() => handleSubmit(form.getValues(), "prospect")}
                                                >{t("button.quote")}</Button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </ButtonGroup>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </ResponsiveDialog>
        </>
    )
}
