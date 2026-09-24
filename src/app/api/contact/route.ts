import { NextResponse } from "next/server";

type Brief = {
  name: string;
  business: string;
  phone: string;
  email: string;
  message: string;
  goal: string;
  services: string[];
  ticket: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Forwards briefs to CONTACT_WEBHOOK_URL (Zapier, Make, Formspree, Slack, a CRM).
// Without it, development logs the brief and production refuses honestly.
export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "That request could not be read." }, { status: 400 });
  }

  const brief: Brief = {
    name: str(raw.name, 120),
    business: str(raw.business, 160),
    phone: str(raw.phone, 40),
    email: str(raw.email, 200),
    message: str(raw.message, 2000),
    goal: str(raw.goal, 120),
    ticket: str(raw.ticket, 12),
    services: Array.isArray(raw.services) ? raw.services.map((s) => str(s, 60)).filter(Boolean).slice(0, 6) : [],
  };

  // Bots fill the hidden field. Pretend it worked.
  if (str(raw.website, 200)) return NextResponse.json({ ok: true });

  if (brief.name.length < 2) {
    return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  }
  if (!brief.phone && !brief.email) {
    return NextResponse.json({ error: "Please add a phone number or an email." }, { status: 422 });
  }
  if (brief.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 422 });
  }

  const payload = { ...brief, source: "justcliks.com", receivedAt: new Date().toISOString() };
  const hook = process.env.CONTACT_WEBHOOK_URL;

  if (!hook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_WEBHOOK_URL is not set. Brief received:", payload);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Our form is not connected yet." }, { status: 503 });
  }

  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[contact] forwarding failed", err);
    return NextResponse.json({ error: "We could not send that just now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
