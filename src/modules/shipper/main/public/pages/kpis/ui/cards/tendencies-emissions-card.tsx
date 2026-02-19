"use client"

import { Area, AreaChart, CartesianGrid, XAxis, } from "recharts"
import { useLocale, useFormatter, useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

type Props = {
    data: {
        carbon: number,
        date: Date
    }[]
}

export function TendenciesEmissionsCard({ data }: Props) {
    const t = useTranslations("Shipper.main.kpis.tendencies.emissions")
    const locale = useLocale()
    const f = useFormatter()

    const chartConfig = {
        carbon: {
            label: t("carbon"),
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
                            <linearGradient id="fillCarbon" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-carbon)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-carbon)"
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
                            dataKey="carbon"
                            type="natural"
                            fill="url(#fillCarbon)"
                            stroke="var(--color-carbon)"
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
                                                {f.number(Number(value), {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                })}
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
