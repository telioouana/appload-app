"use client"

import { z } from "zod"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconChecks, IconContract, IconX } from "@tabler/icons-react"

import { CURRENCY, FISCAL_REGIME, WEIGHT_UNIT } from "@/backend/db/types"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { AcceptOrderForm } from "../form/accept-order-form"
import { useAcceptOrder } from "../../../hooks/use-accept-order"

export function Schema(t: (key: string) => string) {
    const TripSchema = z.object({
        orderId: z.string().nonempty(),
        carrierId: z.string().nonempty(),
        carrierName: z.string().nonempty(),
        driverId: z.string({ error: t("") }).nonempty({ error: t("") }),
        driverName: z.string({ error: t("") }).nonempty({ error: t("") }),
        driverPassport: z.string().optional(),
        driverPhoneNumber: z.string({ error: t("") }).min(9, { error: t("") }).max(15, { error: t("") }),
        truckPlate: z.string().nonempty({ error: t("") }),
        truckAge: z.string(),
        trailerPlate: z.string().optional(),
        linkPlate: z.string().optional(),
        proposedLoadingDate: z.date({ error: t("") }),
        proposedOffloadingDate: z.date({ error: t("") }),
        weightUnit: z.enum(WEIGHT_UNIT),
        fiscalRegime: z.enum(FISCAL_REGIME),
        carrierSubtotal: z.number().nonnegative(),
        carrierVAT: z.number().nonnegative(),
        carrierTotal: z.number().nonnegative(),
        carrierCurrency: z.enum(CURRENCY),
        shipperSubtotal: z.number().nonnegative(),
        shipperVAT: z.number().nonnegative(),
        shipperTotal: z.number().nonnegative(),
        shipperCurrency: z.enum(CURRENCY),
    })

    return TripSchema
}

export const TripSchema = Schema((k: string) => k)
export type TripSchemaForm = z.infer<typeof TripSchema>

export function AcceptOrderDialog() {
    const t = useTranslations("Carrier.order.dialog.accept")
    const { isOpen, onClose, values } = useAcceptOrder()

    const TripSchema = useMemo(() => Schema(t), [t])
    type TripSchemaForm = z.infer<typeof TripSchema>

    const form = useForm<TripSchemaForm>({
        resolver: zodResolver(TripSchema),
        defaultValues: {
            orderId: values?.order.id,
            carrierId: values?.organizationId,
            carrierName: values?.organizationName,

            proposedLoadingDate: values?.order.expectedLoadingDate,
            proposedOffloadingDate: values?.order.expectedOffloadingDate,
            weightUnit: values?.cargo.unit as typeof WEIGHT_UNIT[number],

            fiscalRegime: values?.fiscalRegime,
            carrierSubtotal: values?.fiscalRegime === "normal" ? (Number(values?.order.price) / 1.16) : Number(values?.order.price),
            carrierVAT: values?.fiscalRegime === "normal" ? (Number(values?.order.price) * (0.16 / 1.16)) : 0,
            carrierTotal: Number(values?.order.price),
            carrierCurrency: values?.order.currency as typeof CURRENCY[number],

            shipperSubtotal: values?.fiscalRegime === "normal" ? (Number(values?.order.price) / 1.16) : Number(values?.order.price),
            shipperVAT: values?.fiscalRegime === "normal" ? (Number(values?.order.price) * (0.16 / 1.16)) : 0,
            shipperTotal: Number(values?.order.price),
            shipperCurrency: values?.order.currency as typeof CURRENCY[number]
        }
    })

    function handleClose() {
        form.reset()
        onClose()
    }

    async function handleSubmit(values: TripSchemaForm) {
        window.alert(values)
    }

    if (!values) return null

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
                        <div className="flex max-h-[60vh] px-6 overflow-y-scroll container-snap">
                            <AcceptOrderForm values={values} />
                        </div>

                        <DialogFooter className="flex justify-end items-center border-t p-6 gap-2">
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                >
                                    <IconX />
                                    {t("footer.close")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="success"
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
