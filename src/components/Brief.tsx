"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { goals, services, serviceName, type ServiceKey } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { site, whatsappLink } from "@/lib/site";
import { PostFrame } from "./FeedCard";

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

// Pick a goal, fill the form, and your first post builds itself alongside.
// Sending it publishes the post: it lifts off like it just went live.
export function Brief() {
  const uid = useId();
  const post = useRef<HTMLDivElement>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [picked, setPicked] = useState<ServiceKey[]>([]);
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const chooseGoal = (id: string) => {
    setGoal(id);
    setPicked(goals.find((x) => x.id === id)!.services);
  };

  const toggle = (k: ServiceKey) => {
    setGoal(null);
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  };

  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong sending that.");
      toast.success("Brief sent", { description: "The JustCliks crew will be in touch soon." });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !post.current) return setStatus("sent");
      gsap.to(post.current, {
        y: -60,
        scale: 0.92,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.in",
        onComplete: () => setStatus("sent"),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong sending that.";
      setServerError(msg);
      setStatus("error");
      toast.error("Brief not sent", { description: msg });
    }
  }

  const reset = () => {
    setStatus("idle");
    setValues(blank);
    setPicked([]);
    setGoal(null);
  };

  const replyTo = values.phone.trim() || values.email.trim();
  const show = goals.find((g) => g.id === goal)?.label ?? "Pick a goal";
  const starring = values.business.trim() || values.name.trim() || "Your brand";

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[4.5rem] border-t border-line">
      <div className="wrap grid gap-14 py-28 md:py-40 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id="contact-title" className="t-h2">
            Let&apos;s make something people stop for.
          </h2>
          <p className="t-lead mt-5">Start with what you want. We will suggest the right crew, and you can change it.</p>
          <div role="radiogroup" aria-label="What do you want?" className="mt-8 grid border-t border-line">
            {goals.map((g) => {
              const on = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => chooseGoal(g.id)}
                  className={`flex items-center justify-between gap-4 border-b border-line py-3.5 text-left font-bold ${
                    on ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {g.label}
                  <span aria-hidden className={`size-2.5 shrink-0 ${on ? "bg-orange" : "border border-line-strong"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {status === "sent" ? (
            <div
              aria-live="polite"
              className="flex h-full min-h-[28rem] flex-col justify-between gap-10 bg-orange p-8 text-on-orange md:p-12"
            >
              <p className="t-label">Brief sent</p>
              <p className="t-h2 max-w-[14ch]">Posted. Now we get to work.</p>
              <div>
                <p className="max-w-[42ch] text-lg">
                  Thanks, {values.name.trim().split(" ")[0]}. Your brief is with us and we will reply on {replyTo}.
                </p>
                <button type="button" className="link mt-5 font-bold" onClick={reset}>
                  Send another brief
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-8">
              <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6 md:col-span-5">
                <fieldset>
                  <legend className="text-sm font-bold">Services</legend>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {services.map((sv) => {
                      const on = picked.includes(sv.key);
                      return (
                        <button
                          key={sv.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(sv.key)}
                          className={`border px-3 py-1.5 text-[0.8125rem] font-bold ${
                            on ? "border-fg bg-fg text-bg" : "border-line text-fg hover:border-fg"
                          }`}
                        >
                          {sv.name}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-name`}>Your name</Label>
                    <Input
                      id={`${uid}-name`}
                      autoComplete="name"
                      value={values.name}
                      onChange={set("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    />
                    {errors.name && (
                      <p id={`${uid}-name-err`} className="text-sm font-bold text-orange-ink">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-biz`}>Business or brand</Label>
                    <Input id={`${uid}-biz`} autoComplete="organization" value={values.business} onChange={set("business")} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-phone`}>Phone or WhatsApp</Label>
                    <Input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={set("phone")}
                      aria-invalid={!!errors.contact}
                      aria-describedby={`${uid}-contact-help`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${uid}-email`}>Email</Label>
                    <Input
                      id={`${uid}-email`}
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                    />
                    {errors.email && (
                      <p id={`${uid}-email-err`} className="text-sm font-bold text-orange-ink">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <p
                  id={`${uid}-contact-help`}
                  className={`-mt-2 text-sm ${errors.contact ? "font-bold text-orange-ink" : "text-muted"}`}
                >
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
                  <p role="alert" className="border-[1.5px] border-orange p-4 text-sm font-bold text-orange-ink">
                    {serverError}{" "}
                    {whatsappLink ? (
                      <a className="underline" href={whatsappLink}>
                        Message us on WhatsApp instead.
                      </a>
                    ) : site.email ? (
                      <a className="underline" href={`mailto:${site.email}`}>
                        Email {site.email} instead.
                      </a>
                    ) : (
                      "Please try again in a moment."
                    )}
                  </p>
                )}

                <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[34ch] text-sm text-muted">
                    We only use this to reply to you. See our{" "}
                    <Link href="/privacy" className="font-bold text-fg underline">
                      privacy policy
                    </Link>
                    .
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn btn-primary disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "sending" ? "Sending" : "Send the brief"}
                  </button>
                </div>
              </form>

              {/* Live preview: their first post */}
              <aside aria-label="Preview of your first post" className="md:col-span-3">
                <div className="md:sticky md:top-28">
                  <p className="t-label text-muted">Your first post</p>
                  <div ref={post} className="mt-3 aspect-[4/5] w-full">
                    <PostFrame className="bg-orange text-on-orange">
                      <p className="t-label text-[3.6cqw]">{show}</p>
                      <div>
                        <p className="font-display text-[14cqw] font-extrabold leading-[0.98] tracking-[-0.035em] [overflow-wrap:anywhere]">
                          {starring}
                        </p>
                        <p className="mt-[4cqw] text-[4.6cqw] font-bold">
                          {picked.length ? picked.map(serviceName).join(" + ") : "Crew to be decided"}
                        </p>
                      </div>
                    </PostFrame>
                  </div>
                  <p className="mt-3 text-sm text-muted">It fills in as you type.</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
