import { NextResponse } from "next/server";

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
  } else {
    // No delivery channel configured yet — keep a server-side record.
    console.info("[quote] enquiry received", enquiry);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
