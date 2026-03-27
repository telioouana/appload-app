"use client"

import { useLocale, useTranslations } from "next-intl"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, } from "recharts"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

type Props = {
    data: {
        load: number;
        date: Date | null;
    }[]
}

function pickEvenly<T>(arr: T[], count: number): T[] {
    if (arr.length <= count) return arr
    return Array.from({ length: count }, (_, i) =>
        arr[Math.round(i * (arr.length - 1) / (count - 1))]
    )
}


export function TendenciesLoadingCard({ data }: Props) {
    const t = useTranslations("Shipper.kpis.tendencies.loading")
    const locale = useLocale()

    const xTicks = pickEvenly(data.map(d => d.date), 5)

    const chartConfig = {
        load: {
            label: t("load"),
            color: "var(--chart-3)",
        }
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
                    <BarChart
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
                            ticks={xTicks as unknown as string[]}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString(locale, {
                                    month: "2-digit",
                                    day: "2-digit",
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
                        <Bar
                            dataKey="load"
                            type="natural"
                            fill="var(--color-load)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent className="text-xs font-normal" />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
