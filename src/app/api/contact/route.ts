import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  contactSchema,
  isAllowedFile,
  MAX_FILES,
  MAX_TOTAL_BYTES,
} from "@/lib/contact-schema";

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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(String(form.get("payload") ?? ""));
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

  const files = form
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (
    files.length > MAX_FILES ||
    total > MAX_TOTAL_BYTES ||
    files.some((file) => !isAllowedFile(file.name))
  ) {
    return NextResponse.json({ error: "invalid_files" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "Contact form is missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL",
    );
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const text = [
    `Taal: ${data.lang}`,
    ...data.sections.map(
      (section) =>
        `\n${section.title.toUpperCase()}\n` +
        section.rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
    ),
    files.length
      ? `\nBIJLAGEN\n${files.map((file) => file.name).join("\n")}`
      : "",
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#111;max-width:640px">
    <p style="margin:0 0 20px;color:#666">Nieuwe aanvraag via sharply.nl (${escapeHtml(data.lang)})</p>
    ${data.sections
      .map(
        (section) => `<h3 style="margin:24px 0 8px;font-size:15px;border-bottom:1px solid #e5e5e5;padding-bottom:6px">${escapeHtml(
          section.title,
        )}</h3>
        <table style="border-collapse:collapse;width:100%">${section.rows
          .map(
            (row) =>
              `<tr><td style="padding:5px 16px 5px 0;color:#666;vertical-align:top;width:34%">${escapeHtml(
                row.label,
              )}</td><td style="padding:5px 0;white-space:pre-wrap">${escapeHtml(
                row.value,
              )}</td></tr>`,
          )
          .join("")}</table>`,
      )
      .join("")}
    ${
      files.length
        ? `<h3 style="margin:24px 0 8px;font-size:15px">Bijlagen</h3><p>${files
            .map((file) => escapeHtml(file.name))
            .join("<br>")}</p>`
        : ""
    }
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Sharply aanvraag: ${data.name}${data.company ? ` (${data.company})` : ""}`,
      text,
      html,
      attachments: attachments.length ? attachments : undefined,
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
