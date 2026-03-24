"use client"

import { z } from "zod"
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { IconInvoice, IconSend, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useCreateOffer } from "../../../hooks/use-create-offer";

export function Schema(t: (key: string) => string) {
    return z.object({
        
    })
}

export const OfferSchema = Schema((k: string) => k)
export type OfferSchemaForm = z.infer<typeof OfferSchema>

export function CreateOfferDialog() {
    const t = useTranslations("Carrier.order.dialog.offer")
    const { isOpen, onClose } = useCreateOffer()

    const OfferSchema = Schema(t)
    type OfferSchemaForm = z.infer<typeof OfferSchema>

    const form = useForm<OfferSchemaForm>({
        resolver: zodResolver(OfferSchema),
        values: {}
    })

    async function handleSubmit(values: OfferSchemaForm) {
        window.alert(values)
    }

    function handleClose() {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-2xl max-h-[70vh]" >
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
                        <div className="flex max-h-[50vh] px-6 overflow-y-scroll container-snap">
                            text
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
