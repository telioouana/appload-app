"use client"

import { z } from "zod";
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconDots, IconPlus, IconDeviceFloppy, IconSend } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";
import { CATEGORIES, CURRENCY, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types";

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { FilterType } from "@/modules/main/ui/types";
import { OrderForm } from "@/modules/main/pages/order/ui/forms/order-form";
import { useCreateOrder } from "@/modules/main/pages/order/hooks/use-create-order";

import { useTheme } from "next-themes";

type Props = {
    filter?: FilterType
    publishTo: typeof SHARE[number]
}

export function CreateOrderDialog({ filter, publishTo }: Props) {
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
            .refine((data) => !data.isHazardous || !!data.hazchemCode, {
                error: t("form.cargo.hazchem-code.error"),
                path: ["hazchemCode"]
            })
            .refine((data) => !data.isRefrigerated || data.temperature !== undefined, {
                error: t("form.cargo.temperature.error"),
                path: ["temperature"]
            }),

        share: z.enum(SHARE, { error: t("form.share.error") }),
        price: z.number().optional(),
        currency: z.enum(CURRENCY).optional(),
    })
        .superRefine((data, ctx) => {
            // If share is "subscribers", price and currency MUST exist
            if (data.share === "subscribers") {
                if (!data.price || data.price <= 0) {
                    ctx.addIssue({
                        code: "custom",
                        message: t("form.price.error"),
                        path: ["price"],
                    });
                }
                if (!data.currency) {
                    ctx.addIssue({
                        code: "custom",
                        message: t("form.currency.error"),
                        path: ["currency"],
                    });
                }
            }
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
            share: publishTo
        },
        shouldUnregister: false,
    })

    const orderMutation = useMutation(
        trpc.order.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.orders.all.infiniteQueryOptions({
                    filter,
                    limit: DEFAULT_PAGE_LIMIT,
                }))
                onClose()
            },
            onError: (error) => {
                // TODO: Show error feedback to user
                console.error("Order operation failed:", error)
            }
        }),
    )

    async function handleSave(values: CreateOrderForm) {
        form.clearErrors()
        await orderMutation.mutateAsync({
            status: "drafted",
            values
        })
    }

    async function handleSubmit(values: CreateOrderForm, status: "prospect" | "drafted" | "pending") {
        form.clearErrors()

        const output = await form.trigger([
            "loadingAddress",
            "expectedLoadingDate",
            "offloadingAddress",
            "expectedOffloadingDate",
            "expectedTrucks",
            "cargo.category",
            "cargo.description",
            "cargo.quantity",
            "cargo.unit",
            "cargo.packing",
            "cargo.hazchemCode",
            "cargo.temperature",
            "share",
            "price",
            "currency"
        ], { shouldFocus: true })
        if (!output) return

        await orderMutation.mutateAsync({
            status,
            values
        })
    }

    const { setTheme } = useTheme()

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
                title={t("title")}
                description={t(`description.${form.watch().share}`)}
                onClose={onClose}
                open={isOpen}
                type="dialog"
                className="md:max-w-5xl"
                button={(
                    <Button
                        onClick={() => {
                            // eslint-disable-next-line react-hooks/incompatible-library
                            if (form.watch().share === "non-subscribers") {
                                form.setValue("share", "subscribers")
                                setTheme("light")
                            } else {
                                form.setValue("share", "non-subscribers")
                                setTheme("dark")
                            }
                        }}>
                        {t(`button.${form.watch().share}`)}
                    </Button>
                )}
            >
                <FormProvider {...form}>
                    <form className="flex flex-col gap-6" >
                        <OrderForm isPending={orderMutation.isPending} />

                        <div className="flex justify-between items-center gap-4">
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                    form.reset()
                                    onClose()
                                }}
                                disabled={orderMutation.isPending}
                            >{t("button.cancel")}</Button>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={orderMutation.isPending}
                                    onClick={() => handleSave(form.getValues())}
                                >
                                    {t("button.save")}
                                    {orderMutation.isPending ? <Spinner /> : <IconDeviceFloppy />}
                                </Button>

                                <ButtonGroup aria-disabled={orderMutation.isPending}>
                                    <Button
                                        type="button"
                                        disabled={orderMutation.isPending}
                                        onClick={() => handleSubmit(form.getValues(), "pending")}
                                    >
                                        {t("button.publish")}
                                        {orderMutation.isPending ? <Spinner /> : <IconSend />}
                                    </Button>
                                    <ButtonGroupSeparator />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" size="icon" disabled={orderMutation.isPending} ><IconDots /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    disabled={orderMutation.isPending}
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
