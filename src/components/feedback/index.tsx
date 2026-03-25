"use client"

import dynamic from "next/dynamic"

// Load dynamically to avoid adding html2canvas to server bundles
const FeedbackBubble = dynamic(() => import("./FeedbackBubble"), { ssr: false })

export default function Feedback() {
  return <FeedbackBubble />
}
