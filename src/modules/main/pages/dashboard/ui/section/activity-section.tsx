"use client"

import { useTRPC } from "@/backend/trpc/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IconLink, IconPackages } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function ActivitySection() {
    const t = useTranslations("Main.dashboard.activity")
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.dashboard.activity.queryOptions()
    )
    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-6 gap-8">
                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.all}</span>
                                <span className="text-muted-foreground text-xs">{t("all")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.drafted}</span>
                                <span className="text-muted-foreground text-xs">{t("drafted")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.prospect}</span>
                                <span className="text-muted-foreground text-xs">{t("prospect")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.pending}</span>
                                <span className="text-muted-foreground text-xs">{t("pending")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.shipped}</span>
                                <span className="text-muted-foreground text-xs">{t("on-going")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardContent className="h-16">
                        <div className="flex justify-between items-start">
                            <div className="rounded-md bg-primary/25 size-10 items-center justify-center flex">
                                <IconPackages className="size-6 text-primary" />
                            </div>

                            <div className="flex flex-col gap-2 justify-end">
                                <span className="font-semibold text-primary text-end">{data.delivered}</span>
                                <span className="text-muted-foreground text-xs">{t("delivered")}</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Link href="#" className="text-xs flex gap-1 items-center">View all <IconLink className="size-3" /></Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
