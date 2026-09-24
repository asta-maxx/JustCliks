"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { goals, services, serviceName, type ServiceKey } from "@/lib/content";
import { site, whatsappLink } from "@/lib/site";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { gsap } from "@/lib/gsap";
import { RevealHeading } from "./RevealHeading";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "contact" | "email", string>>;

const blank = { name: "", business: "", phone: "", email: "", message: "", website: "" };

function validate(v: typeof blank): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Tell us your name.";
  if (!v.phone.trim() && !v.email.trim()) e.contact = "Add a phone number or an email so we can reply.";
  if (v.phone.trim() && v.phone.replace(/\D/g, "").length < 8) e.contact = "That phone number looks too short.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "That email doesn't look right.";
  return e;
}

function StubRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-on-accent/25 pt-2">
      <dt className="type-label opacity-75">{k}</dt>
      <dd className="type-credit mt-1 text-[1.7rem] leading-[0.95] [overflow-wrap:anywhere]">{v}</dd>
    </div>
  );
}

// The brief is a cinema ticket. The stub prints what you type, and tears off when you send it.
export function Brief() {
  const uid = useId();
  const stub = useRef<HTMLDivElement>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [picked, setPicked] = useState<ServiceKey[]>([]);
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [ticketNo, setTicketNo] = useState("");

  // The number prints the moment you start filling the ticket in.
  const ensureTicket = () => setTicketNo((t) => t || `JC-${Math.floor(1000 + Math.random() * 9000)}`);

  const chooseGoal = (id: string) => {
    ensureTicket();
    setGoal(id);
    setPicked(goals.find((x) => x.id === id)!.services);
  };

  const toggle = (k: ServiceKey) => {
    ensureTicket();
    setGoal(null);
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  };

  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    ensureTicket();
    setValues((v) => ({ ...v, [k]: e.target.value }));
    // Clear the message for the field being fixed.
    setErrors((prev) => {
      const next = { ...prev };
      if (k === "name") delete next.name;
      if (k === "phone" || k === "email") delete next.contact;
      if (k === "email") delete next.email;
      return next;
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          goal: goals.find((g) => g.id === goal)?.label ?? "",
          services: picked.map(serviceName),
          ticket: ticketNo,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong sending that.");
      toast.success(`Ticket ${ticketNo} booked`, { description: "Your brief is with the JustCliks crew." });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !stub.current) return setStatus("sent");
      gsap.to(stub.current, {
        rotate: 9,
        x: 70,
        y: 40,
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.in",
        transformOrigin: "0% 0%",
        onComplete: () => setStatus("sent"),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong sending that.";
      setServerError(msg);
      toast.error("Ticket not sent", { description: msg });
      setStatus("error");
    }
  }

  const reset = () => {
    setStatus("idle");
    setValues(blank);
    setPicked([]);
    setGoal(null);
    setTicketNo("");
  };

  const replyTo = values.phone.trim() || values.email.trim();
  const show = goals.find((g) => g.id === goal)?.label ?? "Your big moment";
  const starring = values.business.trim() || values.name.trim() || "Your brand";

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <RevealHeading id="contact-title" className="type-mass text-[15vw] md:text-[6rem] lg:text-[5rem]">
            Book a slot.
          </RevealHeading>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-muted">
            Tell us what the show is. We will line up the right services, and you can change them before you send.
          </p>
          <div role="radiogroup" aria-label="What's the show?" className="mt-8 flex flex-col items-start gap-2">
            {goals.map((g) => {
              const on = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => chooseGoal(g.id)}
                  className={`border-[1.5px] px-4 py-3 text-left text-lg font-semibold ${
                    on ? "border-accent bg-accent text-on-accent" : "border-ink/35 hover:border-ink"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {status === "sent" ? (
            <div aria-live="polite" className="flex min-h-[34rem] flex-col justify-between gap-10 bg-accent p-8 text-on-accent md:p-12">
              <p className="type-label">Ticket {ticketNo} booked</p>
              <p className="type-mass text-[14vw] md:text-[6.5rem]">See you on set.</p>
              <div>
                <p className="max-w-[40ch] text-xl leading-snug md:text-2xl">
                  Thanks, {values.name.trim().split(" ")[0]}. Your brief is with us and we will reply on {replyTo}.
                </p>
                <button type="button" className="link mt-6 font-semibold" onClick={reset}>
                  Book another slot
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:ticket md:flex-row md:[--cut:calc(100%-17rem)]">
              {/* Stub first on mobile so it prints above the form */}
              <div
                ref={stub}
                aria-hidden
                className="order-1 flex flex-col justify-between gap-8 bg-accent p-6 text-on-accent md:order-2 md:w-[17rem] md:border-l-2 md:border-dashed md:border-paper"
              >
                <div>
                  <p className="type-label">JustCliks presents</p>
                  <p className="type-mass mt-3 text-[3.2rem] leading-[0.86]">Admit one</p>
                </div>
                <dl className="grid gap-3">
                  <StubRow k="Show" v={show} />
                  <StubRow k="Starring" v={starring} />
                  <StubRow k="Crew" v={picked.length ? picked.map(serviceName).join(", ") : "To be decided"} />
                </dl>
                <p className="type-label">No. {ticketNo || "JC-····"}</p>
              </div>

              <form noValidate onSubmit={onSubmit} className="order-2 flex flex-1 flex-col gap-6 bg-paper-2 p-6 md:order-1 md:p-10">
                <fieldset>
                  <legend className="text-sm font-bold">Crew you need</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {services.map((s) => {
                      const on = picked.includes(s.key);
                      return (
                        <button
                          key={s.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(s.key)}
                          className={`border-[1.5px] px-3 py-2 text-sm font-semibold ${
                            on ? "border-ink bg-ink text-paper" : "border-ink/35 hover:border-ink"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {picked.length ? `${picked.length} selected` : "Not sure yet? Leave these empty."}
                  </p>
                </fieldset>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-name`}>Your name</Label>
                    <Input id={`${uid}-name`} autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} />
                    {errors.name && <p id={`${uid}-name-err`} className="text-sm font-semibold text-accent">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-biz`}>Business or brand</Label>
                    <Input id={`${uid}-biz`} autoComplete="organization" value={values.business} onChange={set("business")} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-phone`}>Phone or WhatsApp</Label>
                    <Input id={`${uid}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} aria-invalid={!!errors.contact} aria-describedby={`${uid}-contact-help`} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-email`}>Email</Label>
                    <Input id={`${uid}-email`} type="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined} />
                    {errors.email && <p id={`${uid}-email-err`} className="text-sm font-semibold text-accent">{errors.email}</p>}
                  </div>
                </div>
                <p id={`${uid}-contact-help`} className={`-mt-3 text-sm ${errors.contact ? "font-semibold text-accent" : "text-muted"}`}>
                  {errors.contact ?? "One of phone or email is enough."}
                </p>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`${uid}-msg`}>Anything else</Label>
                  <Textarea id={`${uid}-msg`} rows={3} value={values.message} onChange={set("message")} maxLength={2000} />
                  <p className="text-sm text-muted">Dates, budget, a link to your page. Whatever helps.</p>
                </div>

                {/* Spam trap, hidden from people */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor={`${uid}-web`}>Website</label>
                  <input id={`${uid}-web`} tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                </div>

                {status === "error" && (
                  <p role="alert" className="border-[1.5px] border-accent p-4 text-sm font-semibold text-accent">
                    {serverError}{" "}
                    {whatsappLink ? (
                      <a className="underline" href={whatsappLink}>Message us on WhatsApp instead.</a>
                    ) : site.email ? (
                      <a className="underline" href={`mailto:${site.email}`}>Email {site.email} instead.</a>
                    ) : (
                      "Please try again in a moment."
                    )}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[36ch] text-sm text-muted">
                    We only use this to reply to you. See our{" "}
                    <Link href="/privacy" className="font-semibold text-ink underline">privacy policy</Link>.
                  </p>
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary h-14 px-8 text-base disabled:cursor-wait disabled:opacity-70">
                    {status === "sending" ? "Printing ticket" : "Book a slot"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
