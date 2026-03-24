"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DataSection from "../section/data-section"

export function DataView() {
    const t = useTranslations("Shipper.market-data.data")

    return (
        <Card className="p-0">
            <CardContent className="p-6 md:p-8">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-xl font-semibold">{t("header.title")}</CardTitle>
                    <CardDescription>{t("header.description")}</CardDescription>
                </CardHeader>

                <Suspense fallback={"...Loading"}>
                    <ErrorBoundary fallback={"Error fetching"}>
                        <DataSection />
                    </ErrorBoundary>
                </Suspense>
            </CardContent>
        </Card>
    )
}
