"use client"

import { z } from "zod"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IconChecks, IconContract, IconX } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"
import { CURRENCY, FISCAL_REGIME, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { createTripSchema } from "../../../schemas/trip"
import { ORDERS_PATH, OrderValues } from "../../../types/types"
import { AcceptOrderForm } from "../form/accept-order-form"
import { useAcceptOrder } from "../../../hooks/use-accept-order"

import { DEFAULT_PAGE_LIMIT } from "@/constants"

export const TripSchema = createTripSchema((k: string) => k)
export type TripSchemaForm = z.infer<typeof TripSchema>

export function AcceptOrderDialog({ path }: { path: ORDERS_PATH }) {
    const { isOpen, onClose, values } = useAcceptOrder()

    if (!values) return null

    return (
        <Render
            isOpen={isOpen}
            onClose={onClose}
            values={values}
            path={path}
        />
    )
}

function Render({ isOpen, onClose, path, values }: { isOpen: boolean, onClose: () => void, path: ORDERS_PATH, values: OrderValues }) {
    const t = useTranslations("Carrier.order.dialog.accept")

    const TripSchema = useMemo(() => createTripSchema(t), [t])
    type TripSchemaForm = z.infer<typeof TripSchema>

    const form = useForm<TripSchemaForm>({
        resolver: zodResolver(TripSchema),
        defaultValues: {
            orderId: values.order.id ?? "",
            carrierId: values.organizationId ?? "",
            carrierName: values.organizationName ?? "",

            loading: values.order.loadingAddress[0],
            proposedLoadingDate: values.order.expectedLoadingDate,
            offloading: values.order.offloadingAddress[0],
            proposedOffloadingDate: values.order.expectedOffloadingDate,
            distance: values.order.distance ?? 0,

            weightUnit: values.cargo.unit as typeof WEIGHT_UNIT[number],

            fiscalRegime: values.fiscalRegime as typeof FISCAL_REGIME[number],
            carrierSubtotal: values.fiscalRegime === "normal" ? (Number(values.order.price) / 1.16) : Number(values.order.price),
            carrierVAT: values.fiscalRegime === "normal" ? (Number(values.order.price) * (0.16 / 1.16)) : 0,
            carrierTotal: Number(values.order.price),
            carrierCurrency: values.order.currency as typeof CURRENCY[number],

            shipperSubtotal: values.fiscalRegime === "normal" ? (Number(values.order.price) / 1.16) : Number(values.order.price),
            shipperVAT: values.fiscalRegime === "normal" ? (Number(values.order.price) * (0.16 / 1.16)) : 0,
            shipperTotal: Number(values.order.price),
            shipperCurrency: values.order.currency as typeof CURRENCY[number]
        },
    })

    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const accept = useMutation(
        trpc.orders.accept.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.orders.all.infiniteQueryOptions({
                    limit: DEFAULT_PAGE_LIMIT,
                    path,
                }))
                queryClient.invalidateQueries(trpc.orders.resume.queryOptions({ path }))
                handleClose()
            }
        })
    )

    function handleClose() {
        form.reset()
        onClose()
    }

    async function handleSubmit(values: TripSchemaForm) {
        form.clearErrors()

        console.log(values)
        accept.mutateAsync({
            values
        })
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl" >
                <DialogHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconContract className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t("header.title")}</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-0.5">{t("header.description")}</DialogDescription>
                        </div>
                    </div>

                    <DialogClose
                        onClick={handleClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-5 text-primary-foreground" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <FormProvider {...form} >
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex max-h-[60vh] px-6 pb-6 overflow-y-scroll container-snap">
                            <AcceptOrderForm values={values} />
                        </div>

                        <DialogFooter className="flex justify-end items-center border-t p-6 gap-2">
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={accept.isPending || form.formState.isSubmitting}
                                >
                                    <IconX />
                                    {t("footer.close")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={accept.isPending || form.formState.isSubmitting}
                                >
                                    <IconChecks />
                                    {t("footer.accept")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
