"use client"

import { z } from "zod";
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDots, IconPlus, IconSend } from "@tabler/icons-react";
import { FieldPath, FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client";
import { cargo, order } from "@/backend/db/schema";
import { CATEGORIES, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { FilterByType, FilterType } from "@/modules/main/ui/types";
import { useUpdateOrder } from "@/modules/main/pages/order/hooks/use-update-order";
import { OrderForm } from "@/modules/main/pages/order/ui/forms/order-form";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    action: "continue" | "update" | "publish"
    filter?: FilterType
    filterBy?: FilterByType
    cargo: typeof cargo.$inferSelect
    order: typeof order.$inferSelect
}

export function UpdateOrderDialog({ action, className, filter, filterBy, cargo, order }: Props) {
    const { isOpen, onClose, onOpenChange } = useUpdateOrder()
    const t = useTranslations("Main.order.update")
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const CreateOrderSchema = z.object({
        loadingAddress: z.array(z.object({
            address: z.string({ error: t("form.loading-address.error") }),
            placeId: z.string(),
            country: z.string(),
            state: z.string(),
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
            .refine((data) => !data.isHazardous || !!data.hazchemCode, {
                error: t("form.cargo.hazchem-code.error"),
                path: ["hazchemCode"]
            })
            .refine((data) => !data.isRefrigerated || data.temperature !== undefined, {
                error: t("form.cargo.temperature.error"),
                path: ["temperature"]
            }),

        share: z.enum(SHARE, { error: t("form.share.error") })
    })

    type CreateOrderForm = z.infer<typeof CreateOrderSchema>

    const form = useForm<CreateOrderForm>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            loadingAddress: [{
                address: order.loadingAddress?.[0].address,
                country: order.loadingAddress?.[0].country,
                placeId: order.loadingAddress?.[0].placeId,
                state: order.loadingAddress?.[0].state,
            }],
            offloadingAddress: [{
                address: order.offloadingAddress?.[0].address,
                country: order.offloadingAddress?.[0].country,
                placeId: order.offloadingAddress?.[0].placeId,
                state: order.offloadingAddress?.[0].state,
            }],
            expectedLoadingDate: order.expectedLoadingDate,
            expectedOffloadingDate: order.expectedOffloadingDate,
            expectedTrucks: order.expectedTrucks ?? 1,
            cargo: {
                category: cargo.category as typeof CATEGORIES[number],
                description: cargo.description,
                quantity: Number(cargo.quantity),
                unit: cargo.unit as typeof WEIGHT_UNIT[number],
                packing: cargo.packing as typeof PACKING[number],
                isHazardous: cargo.isHazardous ?? false,
                hazchemCode: cargo.hazchemCode ?? "",
                isRefrigerated: cargo.isRefrigerated ?? false,
                temperature: Number(cargo.temperature) ?? 0,
                temperatureInstructions: cargo.temperatureInstructions ?? "",
                isGroupageAllowed: cargo.isGroupageAllowed ?? false
            },
            share: order.share as typeof SHARE[number]
        }
    })

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
            onError: (error) => {
                // TODO: Show error feedback to user
                console.error("Order operation failed:", error)
            }
        }),
    )

    async function handleSubmit(values: CreateOrderForm, status: "prospect" | "drafted" | "pending") {
        form.clearErrors()
        const fields: FieldPath<CreateOrderForm>[] = ["loadingAddress", "expectedLoadingDate", "offloadingAddress", "expectedOffloadingDate", "expectedTrucks", "cargo.category", "cargo.description", "cargo.quantity", "cargo.unit", "cargo.packing", "share"]

        if (values.cargo.isHazardous) {
            fields.push("cargo.hazchemCode")
        }

        if (values.cargo.isRefrigerated) {
            fields.push("cargo.temperature")
        }

        const output = await form.trigger(fields, { shouldFocus: true })
        if (!output) return

        await create.mutateAsync({
            status,
            values,
            orderId: order.id,
        })
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className={className}
                onClick={onOpenChange}
            >
                {t(`button.${action}`)}
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
                            >{t("button.cancel")}</Button>

                            <div className="flex gap-4">
                                <ButtonGroup aria-disabled={create.isPending}>
                                    <Button
                                        type="button"
                                        disabled={create.isPending}
                                        onClick={() => handleSubmit(form.getValues(), "pending")}
                                    >
                                        {t(`button.publish.${action}`)}
                                        {create.isPending ? <Spinner /> : <IconSend />}
                                    </Button>
                                    <ButtonGroupSeparator />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" size="icon" disabled={create.isPending} ><IconDots /></Button>
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
