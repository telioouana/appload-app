"use client"

import { z } from "zod"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconSend, IconArrowRight } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

import { useTRPC } from "@/backend/trpc/client"
import { CATEGORIES, CURRENCY, PACKING, SHARE, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/dialog/responsive-dialog"

import { useConfirm } from "@/hooks/use-confirm"

import { ORDERS_PATH } from "../../../types/types"
import { OrderFillForm } from "../form/order-fill-form"
import { useUpdateOrder } from "../../../hooks/use-update-order"
import { UpdateOrderPreviewForm } from "../form/update-order-preview-form"

type Props = {
    path: ORDERS_PATH
    share: typeof SHARE[number]
    search?: string
    cargoType?: string
}

export function UpdateOrderDialog({ path, share, search, cargoType }: Props) {
    const [view, setView] = useState<"form" | "preview">("form")

    const { action, isOpen, onClose, orderId, values } = useUpdateOrder()
    const t = useTranslations("Shipper.order.dialog")
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
            // If share is "subscribers", price and currency MUST exist
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
        values: values,
        shouldUnregister: false,
    })

    function handleClose() {
        setView("form")
        form.reset()
        onClose()
    }

    const [ConfirmDialog, confirm] = useConfirm(`Shipper.main.order.dialog.update.confirm.${form.watch().share as string}`) as [React.ComponentType, () => Promise<boolean>]

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

        // eslint-disable-next-line react-hooks/incompatible-library
        if (values && values.share === form.watch().share) {
            if (share === "subscribers") {
                const ok = await confirm()
                if (ok) {
                    setView("preview")
                    return
                }
                return
            }
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
                    queryClient.invalidateQueries(trpc.private.resume.queryOptions({ path }))
                }
                setView("form")
                onClose()
            },
            onError: (error) => {
                // TODO: Show error feedback to user
                console.error("Order operation failed:", error)
            }
        }),
    )

    async function handlePublish(values: CreateOrderForm) {
        form.clearErrors()
        await mutateAsync({
            values,
            orderId,
            status: "open",
        })
    }

    if (!values) return null

    const views = [
        {
            id: "form",
            render: <OrderFillForm key={"form"} share={share} />
        },
        {
            id: "preview",
            render: <UpdateOrderPreviewForm key={"preview"} values={values} />
        }
    ]

    return (
        <ResponsiveDialog
            title={t(`update.title.${view}${action ? `.${action}` : ""}`)}
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
                                    {t("update.button.cancel")}
                                </Button>


                                <div className="flex gap-4">
                                    <ConfirmDialog />

                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleNext}
                                    >
                                        {t("update.button.preview")}
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
                                    {t("update.button.back")}
                                </Button>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => handlePublish(form.getValues())}
                                    >
                                        {t(`update.button.${action}`)}
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
