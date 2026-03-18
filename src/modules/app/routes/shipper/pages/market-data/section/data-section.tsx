"use client"

import { useFormatter, useTranslations } from "next-intl"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { IconArrowRight, IconCalendar, IconCircleCheck, IconClock, IconInfoCircle, IconMapPin, IconPackage, IconWeight } from "@tabler/icons-react"

import { useTRPC } from "@/backend/trpc/client"

import { DEFAULT_PAGE_LIMIT } from "@/constants"
import { InfiniteScroll } from "@/components/customs/scroll"

export default function DataSection() {
    const t = useTranslations("Shipper.market-data.data")
    const f = useFormatter()
    const trpc = useTRPC()

    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useSuspenseInfiniteQuery(
        trpc.market.history.infiniteQueryOptions({
            limit: DEFAULT_PAGE_LIMIT
        }, {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        })
    )

    if (data.pages[0].items.length === 0) {
        return (
            <div className="text-center py-12">
                <IconCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t("empty")}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t("table.route")}
                </div>
                <div className="shrink-0 w-32 text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                    {t("table.status")}
                </div>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 h-full w-full">
                    {data.pages.flatMap((page) =>
                        page.items.map((values) => {
                            return (
                                <div
                                    key={values.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#ff5722] dark:hover:border-[#ff8a65] transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-1 space-y-2 ">
                                            <div className="flex items-center gap-2">
                                                <IconMapPin className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    <span className="font-medium">{values.loading?.[0]?.state}</span>
                                                    {' '}<IconArrowRight className="w-3 h-3 inline" />{' '}
                                                    <span className="font-medium">{values.offloading?.[0]?.state}</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <IconPackage className="w-3 h-3" />
                                                    <span>{t(`card.category.${values.category}`)}</span>
                                                </div>
                                                {values.quantity && (
                                                    <div className="flex items-center gap-1">
                                                        <IconWeight className="w-3 h-3" />
                                                        <span>{values.quantity} {values.unit}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <IconCalendar className="w-3 h-3" />
                                                    <span>
                                                        {f.dateTime(values.updatedAt, {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            {values.status === "completed"
                                                ? (values.hasData
                                                    ? (
                                                        <div className="inline-flex flex-col items-end">
                                                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full mb-1">
                                                                <IconCircleCheck className="w-3 h-3" />
                                                                {t("card.status.completed.has-data")}
                                                            </span>
                                                            {values.data && (
                                                                <div>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {values.data.minPrice} – {values.data.maxPrice} {values.data.currency}/{values.data.unit}
                                                                    </span>
                                                                    <span></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            <IconInfoCircle className="w-3 h-3" />
                                                            {t("card.status.completed.no-data")}
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                                                        <IconClock className="w-3 h-3" />
                                                        {t("card.status.pending")}
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <InfiniteScroll
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            </div>
        </div>
    )
}
