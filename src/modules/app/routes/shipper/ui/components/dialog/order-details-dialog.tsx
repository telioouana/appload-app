"use client"

import { useState } from "react"
import { IconPackage, IconX } from "@tabler/icons-react"
import { useFormatter, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"

import { OverviewOrderTab } from "../tabs/overview-order-tab"
import { TrackingOrderTab } from "../tabs/tracking-order-tab"
import { useOrderDetails } from "../../../hooks/use-order-details"

type TAB = "overview" | "tracking" | "documents" | "financial" | "timeline"

export function OrderDetailsDialog() {
    const [tab, setTab] = useState<TAB>("overview")

    const t = useTranslations("Shipper.order.dialog.details")
    const { isOpen, onClose, values } = useOrderDetails()
    const f = useFormatter()

    if (!values) return null

    const { order, trip } = values
    const status = trip ? trip.status : order.status

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="p-0 md:max-w-4xl gap-0 flex flex-col max-h-9/12" >
                <DialogHeader className="bg-primary/80 flex flex-col gap-4 rounded-t-xl p-6">
                    <div className="flex gap-2 items-center">
                        <div className="flex bg-primary-foreground/40 size-12 rounded-lg items-center justify-center">
                            <IconPackage className="size-8 text-primary-foreground" stroke={1.2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <DrawerTitle className="text-2xl font-semibold text-primary-foreground leading-tight">{t("header.id", { id: order.legacyId.toString().padStart(4, '0') })}</DrawerTitle>
                            <DrawerDescription className="text-primary-foreground/60">
                                {f.dateTime(order.createdAt, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </DrawerDescription>
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

                <Tabs value={tab} onValueChange={(value) => setTab(value as TAB)} className="flex-1">
                    <div className="p-6 border-b">
                        <TabsList>
                            <TabsTrigger value="overview">{t("tabs.triggers.overview")}</TabsTrigger>
                            <TabsTrigger value="tracking">{t("tabs.triggers.tracking")}</TabsTrigger>
                            <TabsTrigger value="documents">{t("tabs.triggers.documents")}</TabsTrigger>
                            <TabsTrigger value="financial">{t("tabs.triggers.financial")}</TabsTrigger>
                            <TabsTrigger value="timeline">{t("tabs.triggers.timeline")}</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="no-scrollbar p-6 h-full max-h-[40vh] overflow-y-auto">
                        <TabsContent value="overview" className="h-full">
                            <OverviewOrderTab values={values} />
                        </TabsContent>

                        <TabsContent value="tracking" className="h-full">
                            <TrackingOrderTab values={values} />
                        </TabsContent>

                        <TabsContent value="documents">

                            <div className="bg-muted/70 p-4 rounded-xl">
                                Documents
                            </div>
                        </TabsContent>

                        <TabsContent value="financial">

                            <div className="bg-muted/70 p-4 rounded-xl">
                                Financial
                            </div>
                        </TabsContent>

                        <TabsContent value="timeline">

                            <div className="bg-muted/70 p-4 rounded-xl">
                                Timeline
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="p-6 border-t">
                    <Button>Update</Button>
                    <Button>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
