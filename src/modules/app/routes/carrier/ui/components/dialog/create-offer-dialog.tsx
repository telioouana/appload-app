"use client"

import { z } from "zod"
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconInvoice, IconSend, IconX } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { CURRENCY } from "@/backend/db/types";
import { useTRPC } from "@/backend/trpc/client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { createOfferSchema } from "../../../schemas/offer";
import { CreateOfferForm } from "../form/create-offer-form";
import { ORDERS_PATH, OrderValues } from "../../../types/types";
import { useCreateOffer } from "../../../hooks/use-create-offer";

import { DEFAULT_PAGE_LIMIT } from "@/constants";

export function CreateOfferDialog({ path }: { path: ORDERS_PATH }) {
    const { isOpen, onClose, values } = useCreateOffer()

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
    const t = useTranslations("Carrier.offer.create")

    const OfferSchema = useMemo(
        () => createOfferSchema(t),
        [t]
    )
    type OfferSchemaForm = z.infer<typeof OfferSchema>

    const form = useForm<OfferSchemaForm>({
        resolver: zodResolver(OfferSchema),
        defaultValues: {
            orderId: values.order.id,
            carrierId: values.organizationId,
            carrierName: values.organizationName,
            fiscalRegime: values.fiscalRegime,

            proposedLoadingDate: values.order.expectedLoadingDate,
            proposedOffloadingDate: values.order.expectedOffloadingDate,
            currency: values.order.currency as typeof CURRENCY[number],
        },
    })

    const queryClient = useQueryClient()
    const trpc = useTRPC()

    const send = useMutation(
        trpc.offer.send.mutationOptions({
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

    async function handleSubmit(values: OfferSchemaForm) {
        form.clearErrors()
        await send.mutateAsync({ values })
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl max-h-[80vh]" >
                <DialogHeader className="border-b p-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconInvoice className="size-5 text-primary" />
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
                        <div className="flex max-h-[50vh] px-6 pb-6 overflow-y-scroll container-snap">
                            <CreateOfferForm values={values} />
                        </div>

                        <DialogFooter className="flex justify-end items-center border-t p-6 gap-2">
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={send.isPending || form.formState.isSubmitting}
                                >
                                    <IconX />
                                    {t("footer.close")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="success"
                                    disabled={send.isPending || form.formState.isSubmitting}
                                >
                                    <IconSend />
                                    {t("footer.send")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

