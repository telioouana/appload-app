"use client"

import { useTranslations } from "next-intl"
import { IconStarFilled } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarGenerator } from "@/components/customs/avatar";

import { DriverValues } from "../../../../types/types";
import { cn } from "@/lib/utils";

interface Props {
    values: DriverValues
}

export function ListCard({ values }: Props) {
    const t = useTranslations(`Carrier.company.drivers.card`)

    const { name, image, email, phoneNumber } = values.user

    function avatar(className?: string) {
        if (image) {
            return (
                <Avatar className={className}>
                    <AvatarImage src={image} alt="avatar" />
                </Avatar>
            )
        }
        return <AvatarGenerator seed={name} className={className} />
    }

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
            <CardContent className="p-4 grid grid-cols-12 items-center gap-4">
                <div className="grid grid-cols-4 items-center gap-4 col-span-11">
                    <div className="flex items-center gap-3">
                        {avatar("size-12")}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium truncate">{name}</p>
                            <Badge
                                variant="ghost"
                                className={cn(
                                    "inline-block px-1.5 py-0.5 rounded-full items-center text-xs font-medium",
                                    getStatusColor(values.driver.status)
                                )}
                            >
                                {t(`status.${values.driver.status}`)}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            {t("email")}
                        </span>
                        <span className="font-medium">
                            {email}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            {t("phone")}
                        </span>
                        <span className="font-medium">
                            {phoneNumber}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            {t("truck")}
                        </span>
                        <span className="font-medium">
                            {values.truck?.internalId ?? values.truck?.regPlate ?? t("none")}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            {t("rate")}
                        </span>
                        <div className="flex items-center gap-1 text-center">
                            <IconStarFilled className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-muted-foreground">
                                {0}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 truncate">
                        <span className="text-muted-foreground text-xs">
                            Trips:
                        </span>
                        <span className="font-medium text-center">
                            {0}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
