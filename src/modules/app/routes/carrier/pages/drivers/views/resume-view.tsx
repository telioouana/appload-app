"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ErrorBoundary } from "react-error-boundary"
import { useSuspenseQuery } from "@tanstack/react-query"

import { useTRPC } from "@/backend/trpc/client"

import { ResumeCard } from "../components/card/resume-card";

export function ResumeView() {
    const t = useTranslations(`Carrier.company.drivers.resume`)

    const trpc = useTRPC()
    const {
        data: {
            total,
            active,
            idle,
            free
        }
    } = useSuspenseQuery(
        trpc.driver.resume.queryOptions()
    )

    return (
        <Suspense fallback={"Loading..."}>
            <ErrorBoundary fallback={"Error fetching"}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ResumeCard label={t("total")} value={total} />
                    <ResumeCard label={t("active")} value={active} />
                    <ResumeCard label={t("idle")} value={idle} />
                    <ResumeCard label={t("free")} value={free} />
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}
