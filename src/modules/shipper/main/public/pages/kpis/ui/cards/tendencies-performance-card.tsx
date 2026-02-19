"use client"

import { useLocale, useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis, } from "recharts"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

type Props = {
    data: {
        load: number | null;
        offload: number | null;
        date: Date;
    }[]
}

export function TendenciesPerformanceCard({ data }: Props) {
    const t = useTranslations("Shipper.main.kpis.tendencies.performance")
    const locale = useLocale()

    const chartConfig = {

        load: {
            label: t("load"),
            color: "var(--chart-3)",
        },
        offload: {
            label: t("offload"),
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
                <CardTitle className="font-bold">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-48 w-full"
                >
                    <AreaChart
                        accessibilityLayer
                        data={data}
                    >
                        <defs>
                            <linearGradient id="fillLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-load)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-load)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>

                            <linearGradient id="fillOffload" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-offload)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-offload)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString(locale, {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />

                        <Area
                            dataKey="load"
                            type="natural"
                            fill="url(#fillLoad)"
                            stroke="var(--color-load)"
                            stackId="a"
                        />

                        <Area
                            dataKey="offload"
                            type="natural"
                            fill="url(#fillOffload)"
                            stroke="var(--color-offload)"
                            stackId="a"
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name) => (
                                        <>
                                            <div
                                                className="size-2.5 shrink-0 rounded bg-(--color-bg)"
                                                style={
                                                    {
                                                        "--color-bg": `var(--color-${name})`,
                                                    } as React.CSSProperties
                                                }
                                            />
                                            {chartConfig[name as keyof typeof chartConfig]?.label || name}

                                            <div className="text-foreground ml-auto flex items-baseline gap-1.5 font-mono font-medium tabular-nums">
                                                {value}
                                                <span className="text-muted-foreground font-normal">
                                                    {t("unit")}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent className="text-xs font-normal" />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
