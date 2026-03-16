"use client"

import { Pie, PieChart } from "recharts"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

type Props = {
    data: {
        accidents: number;
        mechanical: number;
        docummentation: number;
        inspection: number;
    }
}

export function TendenciesIncidentsCard({ data: { accidents, mechanical, docummentation, inspection } }: Props) {
    const t = useTranslations("Carrier.kpis.tendencies.incidents")
    const chartData = [
        { incident: "accidents", data: accidents, fill: "var(--color-accidents)" },
        { incident: "mechanical", data: mechanical, fill: "var(--color-mechanical)" },
        { incident: "docummentation", data: docummentation, fill: "var(--color-docummentation)" },
        { incident: "inspection", data: inspection, fill: "var(--color-inspection)" },
    ]

    const chartConfig = {
        accidents: {
            label: t("accidents"),
            color: "var(--chart-1)",
        },
        mechanical: {
            label: t("mechanical"),
            color: "var(--chart-2)",
        },
        docummentation: {
            label: t("docummentation"),
            color: "var(--chart-3)",
        },
        inspection: {
            label: t("inspection"),
            color: "var(--chart-4)",
        }
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
                <CardTitle className="font-bold">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="">
                <ChartContainer
                    config={chartConfig}
                    className="flex justify-center items-center [&_.recharts-pie-label-text]:fill-foreground font-medium mx-auto text-base aspect-square max-h-48 w-full"
                >
                    <PieChart
                        margin={{
                            left: 4,
                            right: 4,
                            top: 4,
                        }}
                    >
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
                                            </div>
                                        </>
                                    )}
                                />
                            }
                        />

                        <Pie
                            data={chartData}
                            dataKey="data"
                            labelLine={false}
                            label
                            nameKey="incident"
                            innerRadius={40}
                        />

                        <ChartLegend content={
                            <ChartLegendContent
                                nameKey="incident"
                                className="text-xs font-normal"
                            />
                        } />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}