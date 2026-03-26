"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function FeedbackBubble({ toEmail = "telio@apploadafrica.com" }: { toEmail?: string }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<null | "ok" | "error">(null)

  async function handleSend() {
    setSending(true)
    setStatus(null)
    try {
      // Try to capture screenshot — fall back gracefully if it fails
      let dataUrl: string | undefined
      try {
        const { toPng } = await import('html-to-image')
        dataUrl = await toPng(document.body)
      } catch (screenshotErr) {
        console.warn("Screenshot failed, sending without it:", screenshotErr)
      }

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toEmail, message, screenshot: dataUrl, url: window.location.href }),
      })

      if (res.ok) {
        setStatus("ok")
        setMessage("")
        setOpen(false)
      } else {
        setStatus("error")
      }
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
    setSending(false)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Floating icon button using site Button */}
      <div className="flex items-end">
        <Button
          aria-label={open ? "Close feedback" : "Open feedback"}
          variant={open ? "secondary" : "default"}
          size="icon"
          onClick={() => setOpen((v) => !v)}
          className={cn("shadow-lg", open && "ring-2 ring-offset-2")}
        >
          <span aria-hidden>✉️</span>
        </Button>
      </div>

      {open && (
        <div className="mt-2 w-80 p-3 rounded-md bg-background shadow-lg text-foreground">
          <div className="text-sm mb-2">Report an issue — a screenshot will be attached</div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What happened? Be brief."
            className="min-h-22"
          />

          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => { setOpen(false); setStatus(null); }}>
              Close
            </Button>

            <Button variant="default" size="sm" onClick={handleSend} disabled={sending}>
              {sending ? "Sending…" : "Send"}
            </Button>
          </div>

          {status === "ok" && <div className="mt-2 text-[13px] text-emerald-600">Thanks — feedback sent.</div>}
          {status === "error" && (
            <div className="mt-2 text-[13px] text-destructive">Failed to send. Try again later.</div>
          )}
        </div>
      )}
    </div>
  )
}
