export type ClassValue = string | false | null | undefined;

/** Tiny class-name joiner — keeps conditional Tailwind lists readable. */
export const cn = (...classes: ClassValue[]): string =>
  classes.filter(Boolean).join(" ");

/** Builds a wa.me link with an optional pre-filled message. */
export const whatsappLink = (number: string, message?: string): string => {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
