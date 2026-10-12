/**
 * Contact form contract shared by the client form and the API route,
 * so both sides validate identically.
 */
export const serviceOptions = [
  "Marketing video",
  "Publicitate PPC",
  "Website de prezentare",
  "Magazin online",
  "Mai multe servicii",
  "Nu știu încă",
] as const;

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^[+()\d\s./-]{6,24}$/;

export const limits = { name: 120, email: 200, phone: 24, message: 4000, minMessage: 10 } as const;

export function normalizeContact(raw: Record<string, unknown>): ContactInput {
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return {
    name: text(raw.name).replace(/\s+/g, " "),
    email: text(raw.email).toLowerCase(),
    phone: text(raw.phone),
    service: text(raw.service),
    message: text(raw.message),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (input.name.length < 2) errors.name = "Scrie numele tău (minimum 2 caractere).";
  else if (input.name.length > limits.name) errors.name = `Numele poate avea cel mult ${limits.name} de caractere.`;

  if (!input.email) errors.email = "Adaugă adresa de e-mail la care îți putem răspunde.";
  else if (input.email.length > limits.email || !emailPattern.test(input.email))
    errors.email = "Adresa de e-mail nu pare corectă. Verifică, te rog.";

  if (input.phone && !phonePattern.test(input.phone))
    errors.phone = "Numărul de telefon poate conține doar cifre, spații și semnul +.";

  if (input.service && !serviceOptions.includes(input.service as (typeof serviceOptions)[number]))
    errors.service = "Alege una dintre opțiunile din listă.";

  if (input.message.length < limits.minMessage)
    errors.message = `Spune-ne câteva cuvinte despre proiect (minimum ${limits.minMessage} caractere).`;
  else if (input.message.length > limits.message)
    errors.message = `Mesajul poate avea cel mult ${limits.message} de caractere.`;

  return errors;
}
