"use client"

import { IconX } from "@tabler/icons-react"
import { useTranslations } from "next-intl"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { cn } from "@/lib/utils"

import { OfferCard } from "../card/offer-card"
import { ORDERS_PATH } from "../../../types/types"
import { useOffersList } from "../../../hooks/use-offers-list"

interface Props {
    path: ORDERS_PATH
    search?: string
    cargoType?: string
}

export function OffersListSheet({ path, search, cargoType }: Props) {
    const t = useTranslations("Shipper.offers.header")

    const { isOpen, onClose, offers, order } = useOffersList()
    
    if (!order) return null

    return (
        <Sheet open={isOpen}>
            <SheetContent showCloseButton={false} className={cn("md:w-1/4")} >
                <SheetHeader>
                    <SheetTitle>{t("title")}</SheetTitle>
                    <SheetDescription>{t("description")}</SheetDescription>

                    <SheetClose
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    >
                        <IconX className="size-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetHeader>

                <div className="h-full overflow-y-scroll container-snap p-4 space-y-4">
                    {offers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            order={order}
                            path={path}
                            search={search}
                            cargoType={cargoType} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}
