"use client"

import { IconPackage, IconX } from "@tabler/icons-react"
import { useFormatter, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { OverviewOrderTab } from "../tabs/overview-order-tab"
import { useOrderDetails } from "../../../hooks/use-order-details"

export function OrderDetailsDialog() {
    const t = useTranslations("Carrier.order.dialog.details")
    const { isOpen, onClose, values } = useOrderDetails()
    const f = useFormatter()

    if (!values) return null

    const { order } = values
    const status = order.status

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-4xl gap-0 flex flex-col max-h-[80vh]" >
                <DialogHeader className="bg-primary/80 flex flex-col gap-4 rounded-t-xl p-6">
                    <div className="flex gap-2 items-center">
                        <div className="flex bg-primary-foreground/40 size-12 rounded-lg items-center justify-center">
                            <IconPackage className="size-8 text-primary-foreground" stroke={1.2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <DialogTitle className="text-2xl font-semibold text-primary-foreground leading-tight">{t("header.id", { id: order.legacyId.toString().padStart(4, '0') })}</DialogTitle>
                            <DialogDescription className="text-primary-foreground/60">
                                {f.dateTime(order.createdAt, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-0.5 rounded-md">{t(`header.status.${status}`)}</span>
                        <div className="text-primary-foreground space-x-1">
                            <span>
                                {order.price == null
                                    ? "0"
                                    : f.number(order.price, {
                                        currency: order.currency ?? "MZN",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })
                                }
                            </span>
                            <span>{order.currency ?? "MZN"}</span>
                        </div>
                    </div>

                    <DialogClose
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-5 text-primary-foreground" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                    <div className="no-scrollbar p-6 h-full max-h-[50vh] overflow-y-auto">
                            <OverviewOrderTab values={values} />
                    </div>

                <DialogFooter className="p-6 hidden">
                    <Button>Update</Button>
                    <Button>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
