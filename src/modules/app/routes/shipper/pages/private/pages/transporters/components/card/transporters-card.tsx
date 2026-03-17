"use client"

import { useFormatter, useTranslations } from "next-intl"
import { IconMapPin, IconStarFilled } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerator } from "@/components/customs/avatar";

import { TransporterValues } from "@/modules/app/routes/shipper/types/types";

interface Props {
    values: TransporterValues
}

export function TransportersCard({ values }: Props) {
    const t = useTranslations(`Shipper.private.transporters.card`)
    const f = useFormatter()

    const { name, logo, address, trips, paid, } = values

    function avatar(className?: string) {
        if (logo) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={logo} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

    return (
        <Card className="p-0 border border-card hover:border-primary">
            <CardContent className="p-4 grid grid-cols-12 items-center gap-4">
                <div className="grid grid-cols-4 items-center gap-4 col-span-11">
                    <div className="flex items-center gap-3 truncate col-span-2">
                        {avatar("size-12 rounded-md")}

                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium truncate">{name}</p>
                            <p className="text-xs font-medium truncate flex gap-1 items-center text-muted-foreground">
                                <IconMapPin className="size-3" stroke={1} />
                                {address}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 col-span-2 items-center gap-8 w-full justify-end">
                        <div className="col-span-2" />
                        <div className="flex flex-col gap-1 truncate justify-end">
                            <span className="text-muted-foreground text-xs">
                                {t("trips")}
                            </span>
                            <span className="font-medium">
                                {trips}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 truncate justify-end">
                            <span className="text-muted-foreground text-xs">
                                {t("paid")}
                            </span>
                            <span className="font-medium">
                                {f.number(paid, {
                                    currency: "MZN",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    currencyDisplay: "code",
                                    currencySign: "accounting",
                                    compactDisplay: "long"
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-1 text-end">
                    <IconStarFilled className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                        {0}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
