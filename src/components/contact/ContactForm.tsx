"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { site } from "@/content/site";
import {
  limits,
  normalizeContact,
  serviceOptions,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

const fieldBase =
  "mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ash transition-colors duration-200 focus:outline-none focus:ring-0";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label flex justify-between gap-4 text-graphite">
        <span>{label}</span>
        {hint ? <span className="normal-case tracking-normal text-ash">{hint}</span> : null}
      </label>
      {children}
      <p id={`${id}-error`} className="mt-2 min-h-5 text-sm text-signal" aria-live="polite">
        {error ?? ""}
      </p>
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const read = (form: HTMLFormElement) =>
    normalizeContact(Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>);

  const revalidate = () => {
    if (!touched || !formRef.current) return;
    setErrors(validateContact(read(formRef.current)));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setTouched(true);
    const data = read(form);
    const found = validateContact(data);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0] as keyof ContactInput | undefined;
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Honeypot filled in: almost certainly a bot. Show success, send nothing.
    if ((form.elements.namedItem("website") as HTMLInputElement | null)?.value) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    setServerMessage("");
    const fail = (message: string) => {
      setServerMessage(message);
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    };

    try {
      // AJAX request to FormSubmit, which e-mails the submission to contact@impactomedia.ro.
      // "email" is used as reply-to, so answering the e-mail goes straight to the visitor.
      const response = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Mesaj nou de pe impactomedia.ro de la ${data.name}${data.service ? ` · ${data.service}` : ""}`,
          _template: "table",
          _captcha: "false",
          Nume: data.name,
          email: data.email,
          Telefon: data.phone || "-",
          Interes: data.service || "-",
          Mesaj: data.message,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean | string; message?: string };
      if (response.ok && String(result.success) === "true") {
        setStatus("sent");
        form.reset();
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (result.message) console.error("[contact]", result.message);
      // Only before the one-time activation link in contact@impactomedia.ro has been clicked.
      if (/activat/i.test(result.message ?? "")) {
        fail(`Formularul așteaptă activarea: deschide e-mailul trimis de FormSubmit la ${site.email} și apasă „Activate Form”.`);
        return;
      }
      fail("Mesajul nu a putut fi trimis.");
    } catch {
      fail("Nu am putut trimite mesajul. Verifică conexiunea la internet.");
    }
  }

  const border = (key: keyof ContactInput) => (errors[key] ? "border-signal" : "border-ink/30 hover:border-ink focus:border-ink");
  const described = (key: keyof ContactInput) => (errors[key] ? `${key}-error` : undefined);
  const transition = { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="sent"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            className="border-t border-ink pt-10 outline-none"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <p className="type-label text-signal">Mesaj trimis</p>
            <h2 className="type-h2 mt-6">Mulțumim. Am primit mesajul tău.</h2>
            <p className="type-lead mt-6 max-w-lg text-graphite">
              Îți răspundem la adresa de e-mail pe care ne-ai lăsat-o. Dacă e urgent, ne poți suna la{" "}
              <a href={site.phone.href} className="link-static text-ink">
                {site.phone.display}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="group mt-10 inline-flex items-center gap-2 font-medium"
            >
              <span className="link-line">Trimite un alt mesaj</span>
              <ArrowRight className="arrow-nudge arrow-nudge-right" />
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            onChange={revalidate}
            aria-describedby="contact-privacy"
            className="grid gap-x-8 gap-y-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <Field id="name" label="Nume" error={errors.name}>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={limits.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={described("name")}
                className={`${fieldBase} ${border("name")}`}
              />
            </Field>

            <Field id="email" label="E-mail" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={limits.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={described("email")}
                className={`${fieldBase} ${border("email")}`}
              />
            </Field>

            <Field id="phone" label="Telefon" hint="opțional" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={limits.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={described("phone")}
                className={`${fieldBase} ${border("phone")}`}
              />
            </Field>

            <Field id="service" label="Ce te interesează" hint="opțional" error={errors.service}>
              <div className="relative">
                <select
                  id="service"
                  name="service"
                  defaultValue=""
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={described("service")}
                  className={`${fieldBase} ${border("service")} appearance-none pr-8`}
                >
                  <option value="">Alege o opțiune</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 mt-1 -translate-y-1/2 text-sm">
                  ↓
                </span>
              </div>
            </Field>

            <div className="md:col-span-2">
              <Field id="message" label="Mesaj" error={errors.message}>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={limits.message}
                  placeholder="Spune-ne pe scurt despre proiect, obiectiv și termen."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={described("message")}
                  className={`${fieldBase} ${border("message")} resize-y`}
                />
              </Field>
            </div>

            {/* Honeypot for bots; hidden from people and assistive technology. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col gap-6 border-t border-line pt-6 md:col-span-2 md:flex-row md:items-center md:justify-between">
              <p id="contact-privacy" className="max-w-md text-sm text-graphite">
                Folosim datele doar pentru a răspunde solicitării tale. Detalii în{" "}
                <Link href="/politica-de-confidentialitate" className="link-static text-ink">
                  Politica de confidențialitate
                </Link>
                .
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex min-h-13 shrink-0 items-center justify-between gap-8 bg-ink px-6 py-4 font-medium text-paper transition-colors duration-200 hover:bg-signal disabled:cursor-progress disabled:opacity-70"
              >
                {status === "sending" ? "Se trimite…" : "Trimite mesajul"}
                <ArrowRight className="arrow-nudge arrow-nudge-right" />
              </button>
            </div>

            <div ref={statusRef} tabIndex={-1} role="alert" className="outline-none md:col-span-2">
              {status === "error" ? (
                <div className="border-l-2 border-signal bg-paper-deep px-5 py-4">
                  <p className="font-medium">{serverMessage}</p>
                  <p className="mt-1 text-graphite">
                    Ne poți scrie direct la{" "}
                    <a href={`mailto:${site.email}`} className="link-static text-ink">
                      {site.email}
                    </a>{" "}
                    sau ne poți suna la{" "}
                    <a href={site.phone.href} className="link-static text-ink">
                      {site.phone.display}
                    </a>
                    .
                  </p>
                </div>
              ) : null}
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
