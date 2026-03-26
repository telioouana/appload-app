"use client"

import { z } from "zod"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconDeviceFloppy, IconSend, IconArrowRight } from "@tabler/icons-react"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { CATEGORIES, CURRENCY, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"

import { useConfirm } from "@/hooks/use-confirm"

import { ORDERS_PATH } from "../../../types/types"
import { OrderFillForm } from "../form/order-fill-form"
import { useCreateOrder } from "../../../hooks/use-create-order"
import { CreateOrderPreviewForm } from "../form/create-order-preview-form"

type Props = {
    path: ORDERS_PATH
    share: typeof SHARE[number]
    search?: string
    cargoType?: string
}

export function CreateOrderDialog({ path, share, search, cargoType }: Props) {
    const [view, setView] = useState<"form" | "preview">("form")

    const t = useTranslations("Shipper.order.dialog")
    const { isOpen, onClose } = useCreateOrder()
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

        share: z.enum(SHARE),
        price: z.number().optional(),
        currency: z.enum(CURRENCY),
    })
        .superRefine((data, ctx) => {
            // If share is "subscrib ers", price and currency MUST exist
            if (data.share === "subscribers") {
                if (!data.price || data.price <= 0) {
                    ctx.addIssue({
                        code: "custom",
                        message: t("form.price.error"),
                        path: ["price"],
                    })
                }
            }
        })

    type CreateOrderForm = z.infer<typeof CreateOrderSchema>

    const form = useForm<CreateOrderForm>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            expectedTrucks: 1,
            cargo: {
                unit: "ton",
                temperature: 0,
                isHazardous: false,
                isRefrigerated: false,
                isGroupageAllowed: false
            },
            share: share,
            currency: "MZN"
        },
        shouldUnregister: false,
    })

    function handleClose() {
        setView("form")
        form.reset()
        onClose()
    }

    // eslint-disable-next-line react-hooks/incompatible-library
    const [ConfirmDialog, confirm] = useConfirm(`Shipper.order.dialog.create.confirm.${form.watch().share as string}`) as [React.ComponentType, () => Promise<boolean>]
    async function handleNext() {
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

        if (share === "subscribers") {
            const ok = await confirm()
            if (ok) {
                setView("preview")
                return
            }
            return
        }
        setView("preview")
    }

    function handleBack() {
        setView("form")
    }

    const { isPending, mutateAsync } = useMutation(
        trpc.shipperOrder.create.mutationOptions({
            onSuccess: () => {
                if (share === "subscribers") {
                    queryClient.invalidateQueries(trpc.private.orders.infiniteQueryOptions({
                        path,
                        limit: DEFAULT_PAGE_LIMIT,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                    queryClient.invalidateQueries(trpc.private.resume.queryOptions({
                        path,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                } else {
                    queryClient.invalidateQueries(trpc.public.orders.infiniteQueryOptions({
                        path,
                        limit: DEFAULT_PAGE_LIMIT,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                    queryClient.invalidateQueries(trpc.public.resume.queryOptions({
                        path,
                        search: search?.trim() || undefined,
                        cargoType: cargoType?.trim() || undefined,
                    }))
                }
                handleClose()
            },
            onError: (error) => {
                // TODO: Show error feedback to user
                console.error("Order operation failed:", error)
            }
        }),
    )

    async function handlePublish(values: CreateOrderForm, status: "drafted" | "open") {
        form.clearErrors()
        await mutateAsync({
            status,
            values
        })
    }

    const views = [
        {
            id: "form",
            render: <OrderFillForm share={share} key={"form"} />
        },
        {
            id: "preview",
            render: <CreateOrderPreviewForm key={"preview"} />
        }
    ]

    return (
        <ResponsiveDialog
            title={t(`create.title.${view}`)}
            onClose={handleClose}
            open={isOpen}
            type="dialog"
            className="md:max-w-3xl"
        >
            <FormProvider {...form}>
                <form className="flex flex-col gap-6" >
                    {views.map(({ id, render }) => {
                        return id === view && render
                    })}

                    <div className="border-t p-6">
                        {view === "form" && (
                            <div className="flex justify-between items-center gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={isPending}
                                    onClick={handleClose}
                                >
                                    {t("create.button.cancel")}
                                </Button>


                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        onClick={() => handlePublish(form.getValues(), "drafted")}
                                    >
                                        {t("create.button.save")}
                                        {<IconDeviceFloppy />}
                                    </Button>

                                    <ConfirmDialog />

                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleNext}
                                    >
                                        {t("create.button.preview")}
                                        {<IconArrowRight />}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {view === "preview" && (
                            <div className="flex justify-between items-center gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    disabled={isPending}
                                    onClick={handleBack}
                                >
                                    {t("create.button.back")}
                                </Button>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => handlePublish(form.getValues(), "open")}
                                    >
                                        {t("create.button.publish")}
                                        {<IconSend />}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </FormProvider>
        </ResponsiveDialog>
    )
}
