import { NextRequest } from "next/server"
import { Resend } from "resend"
import { headers } from "next/headers"
import { auth } from "@/backend/auth"

const RESEND_API_KEY = process.env.RESEND_API_SECRET
const FROM = process.env.FEEDBACK_FROM || "no-reply@no-reply.appload.co.mz"
const TO_DEFAULT = "telio@apploadafrica.com"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || !body.message) {
    return new Response(JSON.stringify({ ok: false, error: "invalid" }), { status: 400 })
  }

  const to = body.to || TO_DEFAULT
  const { message, screenshot, url, name, email } = body

  const session = await auth.api.getSession({ headers: await headers() })
  const loggedUser = session?.user?.name || session?.user?.email || null

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — logging feedback instead of sending email")
    console.log({ to, message, url, name, email })
    return new Response(JSON.stringify({ ok: true, logged: true }))
  }

  const resend = new Resend(RESEND_API_KEY)

  const senderLine = email ? `<p><strong>From:</strong> ${escapeHtml(name || email)}${name ? ` &lt;${escapeHtml(email)}&gt;` : ""}</p>` : ""
  const loggedUserLine = loggedUser ? `<p><strong>Logged user:</strong> ${escapeHtml(loggedUser)}</p>` : ""
  const html = `
    <div>
      <p><strong>Feedback:</strong></p>
      <p>${escapeHtml(message)}</p>
      ${senderLine}
      ${loggedUserLine}
      <p><strong>URL:</strong> <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
      ${screenshot ? `<p><img src="${screenshot}" alt="screenshot" style="max-width:100%"/></p>` : ""}
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: "User feedback report",
      html,
    })
    if (result.error) {
      console.error("Resend error:", result.error)
      return new Response(JSON.stringify({ ok: false, error: result.error.message, details: result.error }), { status: 500 })
    }
    return new Response(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error("Feedback send exception:", err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
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
