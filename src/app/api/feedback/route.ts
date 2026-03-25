import { NextRequest } from "next/server"
import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_SECRET
const FROM = process.env.FEEDBACK_FROM || "onboarding@resend.dev"
const TO_DEFAULT = "info@apploadafrica.com"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.message) {
    return new Response(JSON.stringify({ ok: false, error: "invalid" }), { status: 400 })
  }

  const to = body.to || TO_DEFAULT
  const { message, screenshot, url } = body

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — logging feedback instead of sending email")
    console.log({ to, message, url })
    return new Response(JSON.stringify({ ok: true, logged: true }))
  }

  const resend = new Resend(RESEND_API_KEY)

  const html = `
    <div>
      <p><strong>Feedback:</strong></p>
      <p>${escapeHtml(message)}</p>
      <p><strong>URL:</strong> <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
      ${screenshot ? `<p><img src="${screenshot}" alt="screenshot" style="max-width:100%"/></p>` : ""}
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "User feedback report",
      html,
    })
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ ok: false, error: "send_failed" }), { status: 500 })
  }
}

function escapeHtml(input: string) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
}
