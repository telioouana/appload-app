"use client"

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconChecks, IconClock, IconInvoice, IconLink, IconPackages, IconPencilMinus, IconTruckDelivery } from "@tabler/icons-react";

import { useTRPC } from "@/backend/trpc/client";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { UserType } from "@/modules/main/ui/types";

export function ActivitySection({ userType }: { userType: UserType }) {
    const t = useTranslations("Main.dashboard.activity")
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.dashboard.activity.queryOptions()
    )
    return (
        <div className="flex flex-col gap-8 w-full">
            <div className={cn(
                "grid gap-8",
                userType === "shipper" ? "grid-cols-6" : "grid-cols-5"
            )}>
                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.all}</span>
                                <span className="text-muted-foreground text-xs">{t(`all.${userType}`)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/orders" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                <span>{t("link")}</span>
                                <IconLink className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {userType === "shipper" && (
                    <Card>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                    <IconPencilMinus className="size-6 text-primary" />
                                </div>

                                <div className="flex flex-col gap-2 justify-end">
                                    <span className="font-semibold text-primary text-end">{data.drafted}</span>
                                    <span className="text-muted-foreground text-xs">{t("drafted")}</span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link href="/orders/drafted" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                    <span>{t("link")}</span>
                                    <IconLink className="size-3" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconInvoice className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.prospect}</span>
                                <span className="text-muted-foreground text-xs">{t("prospect")}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/quote-requests" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                <span>{t("link")}</span>
                                <IconLink className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconClock className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.pending}</span>
                                <span className="text-muted-foreground text-xs">{t("pending")}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/orders/pending" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                <span>{t("link")}</span>
                                <IconLink className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconTruckDelivery className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.shipped}</span>
                                <span className="text-muted-foreground text-xs">{t("on-going")}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/orders/on-going" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                <span>{t("link")}</span>
                                <IconLink className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconChecks className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.delivered}</span>
                                <span className="text-muted-foreground text-xs">{t("delivered")}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/orders/delivered" className="text-xs flex gap-2 items-center hover:text-primary hover:cursor-pointer hover:underline-offset-4 hover:underline">
                                <span>{t("link")}</span>
                                <IconLink className="size-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
