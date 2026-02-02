"use client"

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { UserType } from "@/modules/main/ui/types";
import { ResumeSection } from "@/modules/main/pages/dashboard/ui/section/resume-section";

export function ResumeView({ endDate, startDate, userType }: { endDate: Date, startDate: Date, userType: UserType }) {
    const [date, setDate] = useState<Date>(startDate)

    return (
        <Suspense fallback={<div>Loading resume...</div>}>
            <ErrorBoundary fallback={<div>Error loading resume.</div>}>
                <ResumeSection
                    endDate={endDate}
                    startDate={date}
                    setStartDate={setDate}
                    userType={userType}
                />
            </ErrorBoundary>
        </Suspense>
    )
}
