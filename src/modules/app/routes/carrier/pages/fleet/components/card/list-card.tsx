"use client"

import Image from "next/image";

import { useTranslations } from "next-intl"
import { IconLineDashed } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { FleetValues } from "../../../../types/types";

import { cn } from "@/lib/utils";

interface Props {
    values: FleetValues
}

export function ListCard({ values }: Props) {
    const t = useTranslations(`Carrier.company.fleet.card`)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "idle":
                return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
            case "free":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <Card className="p-0 border border-card hover:border-primary">
            <CardContent className="p-4">
                <div className="grid grid-cols-4 items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-30 h-10 shrink-0">
                            <Image
                                src="/trucks/truck-icon.svg"
                                alt="truck icon"
                                width={1}
                                height={1}
                                priority
                                className="w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium truncate">{values.truck.internalId ?? values.truck.regPlate}</p>
                            <p className="text-sm font-medium truncate">{t(`type.${values.truck.type}`)}</p>
                            <Badge
                                variant="ghost"
                                className={cn(
                                    "inline-block px-1.5 py-0.5 rounded-full items-center text-xs font-medium",
                                    getStatusColor(values.truck.status)
                                )}
                            >
                                {t(`status.${values.truck.status}`)}
                            </Badge>
                        </div>
                    </div>

                    {values.truck.type === "non-articulated"
                        ? (
                            <>
                                <div className="flex flex-col gap-1 truncate">
                                    <span className="text-muted-foreground text-xs">
                                        {t("loading-bay.label")}
                                    </span>
                                    <span className="font-medium">
                                        {t(`loading-bay.${values.truck.loadingBay?.type}`)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 truncate">
                                    <span className="text-muted-foreground text-xs">
                                        {t("capacity")}
                                    </span>
                                    <span className="font-medium">
                                        {values.truck.loadingBay?.capacity} ton
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2">
                                <div className="flex flex-col gap-1 truncate">
                                    <span className="text-muted-foreground text-xs">
                                        {t("trailer")}
                                    </span>
                                    <span className="font-medium">
                                        {values.trailer?.internalId ?? values.trailer?.regPlate}
                                    </span>
                                    <div className="font-medium flex gap-2 items-center">
                                        <span>{values.trailer?.loadingBay.capacity} ton</span>
                                        <IconLineDashed className="size-4 text-muted-foreground" stroke={1.5} />
                                        <span>{t(`loading-bay.${values.trailer?.loadingBay.type}`)}</span>
                                    </div>
                                </div>

                                {values.link && (
                                    <div className="flex flex-col gap-1 truncate">
                                        <span className="text-muted-foreground text-xs">
                                            {t("link")}
                                        </span>
                                        <span className="font-medium">
                                            {values.link.internalId ?? values.link?.regPlate}
                                        </span>
                                        <div className="font-medium flex gap-2">
                                            <span>{values.link.loadingBay.capacity} ton</span>
                                            <IconLineDashed />
                                            <span>{t(`loading-bay.${values.link.loadingBay.type}`)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            {t("driver")}
                        </span>
                        <span className="font-medium">
                            {values.user?.name ?? t("none")}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}
