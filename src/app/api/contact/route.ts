import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";

/** Coarse per-instance throttle. Enough to stop a bored script, not a firewall. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot filled means a bot. Answer with success so it stops retrying.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const lines: [string, string][] = [
    ["Naam", data.name],
    ["E-mail", data.email],
    ["Bedrijf", data.company || "-"],
    ["Telefoon", data.phone || "-"],
    ["Taal", data.lang],
    ["Nodig", data.needs.join(", ")],
    ["Budget", data.budget],
    ["Planning", data.timeline],
    ["Project", data.project],
    ["Referenties", data.references || "-"],
  ];

  const text = lines.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${lines
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Sharply aanvraag: ${data.name}${data.company ? ` (${data.company})` : ""}`,
      text,
      html,
    });

    if (result.error) {
      console.error("Resend rejected the message", result.error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (error) {
    console.error("Sending the contact mail threw", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
