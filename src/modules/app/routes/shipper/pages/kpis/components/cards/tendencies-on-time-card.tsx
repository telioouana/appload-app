"use client"

import { useLocale, useTranslations } from "next-intl"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, } from "recharts"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

type Props = {
    data: {
        totalOnTime: number;
        total: number;
        date: Date | null;
    }[]
}

export function TendenciesOnTimeCard({ data }: Props) {
    const t = useTranslations("Shipper.kpis.tendencies.on-time")
    const locale = useLocale()

    const chartConfig = {
        totalOnTime: {
            label: t("total-on-time"),
            color: "var(--chart-3)",
        },
        total: {
            label: t("total"),
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
                    className="flex justify-center items-center [&_.recharts-pie-label-text]:fill-foreground font-medium mx-auto text-base aspect-square max-h-48 w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 4,
                            right: 4,
                            top: 4,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString(locale, {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
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
                        <Line
                            dataKey="totalOnTime"
                            type="monotone"
                            stroke="var(--color-totalOnTime)"
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey="total"
                            type="monotone"
                            stroke="var(--color-total)"
                            strokeWidth={2}
                            dot={true}
                        />
                        <ChartLegend content={<ChartLegendContent className="text-xs font-normal" />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
