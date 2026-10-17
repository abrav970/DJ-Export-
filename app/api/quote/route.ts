import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/**
 * Quotation enquiry endpoint.
 *
 * The submission is validated and recorded here. This is the single place to
 * connect the site to a delivery channel — an email provider, a CRM, a WhatsApp
 * Business API or an internal webhook — without touching the form component.
 */

type QuotePayload = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  quantity: string;
  packaging?: string;
  message?: string;
};

const required: (keyof QuotePayload)[] = [
  "name",
  "companyName",
  "email",
  "phone",
  "country",
  "product",
  "quantity",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Sends the enquiry by SMTP. Returns false when SMTP is not configured. */
async function sendEmail(enquiry: Record<string, unknown>): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_NOTIFICATION_EMAIL } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !QUOTE_NOTIFICATION_EMAIL) return false;

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = Object.entries(enquiry)
    .filter(([, v]) => String(v ?? "").trim())
    .map(([k, v]) => `${k}: ${String(v)}`);

  const body = rows.join("\n");

  await transporter.sendMail({
    from: `"DJ Export website" <${SMTP_USER}>`,
    to: QUOTE_NOTIFICATION_EMAIL,
    replyTo: String(enquiry.email),
    subject: `New quote enquiry — ${String(enquiry.product)} from ${String(enquiry.companyName)}`,
    text: body,
    html: `<pre style="font:14px/1.6 sans-serif">${escapeHtml(body)}</pre>`,
  });
  return true;
}

export async function POST(request: Request) {
  let payload: Partial<QuotePayload>;

  try {
    payload = (await request.json()) as Partial<QuotePayload>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const missing = required.filter((field) => !String(payload[field] ?? "").trim());
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing required fields.", fields: missing },
      { status: 422 },
    );
  }

  if (!emailPattern.test(String(payload.email))) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }

  const enquiry = {
    receivedAt: new Date().toISOString(),
    ...payload,
  };

  let emailed = false;
  try {
    emailed = await sendEmail(enquiry);
  } catch (error) {
    console.error("[quote] email delivery failed", error);
    return NextResponse.json({ error: "Enquiry could not be delivered." }, { status: 502 });
  }

  // Forward to a webhook when one is configured (CRM, automation, inbox rule).
  const webhook = process.env.QUOTE_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
    } catch (error) {
      console.error("[quote] webhook delivery failed", error);
      return NextResponse.json(
        { error: "Enquiry could not be delivered." },
        { status: 502 },
      );
    }
  } else if (!emailed) {
    // No delivery channel configured yet — keep a server-side record.
    console.info("[quote] enquiry received", enquiry);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
