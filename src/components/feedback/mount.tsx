"use client"

import { useEffect } from "react"
import Feedback from "./index"

export function FeedbackMount() {
    useEffect(() => {
        console.log("FeedbackMount: mounted")
        // also log root existence
        const el = document.getElementById("appload-feedback-root")
        console.log("appload-feedback-root exists:", !!el)
    }, [])

    // Let Next hydrate the client component normally.
    return <Feedback />
}
