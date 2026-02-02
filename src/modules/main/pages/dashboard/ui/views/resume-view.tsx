"use client"

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { UserType } from "@/modules/main/ui/types";
import { ResumeSection } from "@/modules/main/pages/dashboard/ui/section/resume-section";

export function ResumeView({ endDate, userType }: { endDate: Date, userType: UserType }) {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)))
    
    return (
        <Suspense fallback={<div>Loading resume...</div>}>
            <ErrorBoundary fallback={<div>Error loading resume.</div>}>
                <ResumeSection 
                endDate={endDate} 
                startDate={startDate} 
                setStartDate={setStartDate}
                userType={userType} 
                />
            </ErrorBoundary>
        </Suspense>
    )
}
