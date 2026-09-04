"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/company";
import { productOptions } from "@/data/products";
import { easePremium } from "@/lib/motion";
import { cn, whatsappLink } from "@/lib/utils";

type Fields = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  quantity: string;
  packaging: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  country: "",
  product: "",
  quantity: "",
  packaging: "",
  message: "",
};

const packagingOptions = [
  "Standard export packing",
  "Jute bags",
  "PP / laminated bags",
  "Vacuum packing",
  "Bulk / jumbo bags",
  "Buyer-specified packing",
];

/** The query string never changes without a navigation, so nothing to subscribe to. */
const subscribeToNothing = () => () => {};
const getUrlProduct = () =>
  new URLSearchParams(window.location.search).get("product") ?? "";
const getServerProduct = () => "";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (values: Fields): Errors => {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (values.companyName.trim().length < 2)
    errors.companyName = "Please enter your company name.";
  if (!emailPattern.test(values.email.trim()))
    errors.email = "Please enter a valid business email address.";
  if (values.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Please enter a contactable phone or WhatsApp number.";
  if (values.country.trim().length < 2)
    errors.country = "Please enter the destination country.";
  if (!values.product) errors.product = "Please select a product.";
  if (values.quantity.trim().length < 1)
    errors.quantity = "Please tell us the quantity you need.";
  return errors;
};

/**
 * B2B enquiry form.
 *
 * Submits to /api/quote, which currently records the enquiry server-side. That
 * route is the single place to wire up email, a CRM, WhatsApp or any other
 * endpoint — the form itself does not need to change.
 */
export const QuoteForm = ({ tone = "dark" }: { tone?: "dark" | "light" }) => {
  const formId = useId();

  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  /*
   * Pre-select the product from ?product=<slug>.
   *
   * Read straight from window.location rather than with useSearchParams().
   * useSearchParams() forces this subtree behind a Suspense boundary on a
   * statically prerendered route, and that boundary never resolved on the
   * client — React left the server HTML in place, unhydrated, so the form
   * submitted natively as a GET and the enquiry was silently lost.
   *
   * useSyncExternalStore (rather than an effect) keeps the server snapshot
   * empty, which is what the prerendered HTML contains, so there is no
   * hydration mismatch and no setState during render or in an effect.
   */
  const urlSlug = useSyncExternalStore(subscribeToNothing, getUrlProduct, getServerProduct);
  const preselected = productOptions.some((option) => option.value === urlSlug)
    ? urlSlug
    : "";
  /** The user's own choice wins once they have made one. */
  const product = values.product || preselected;

  const dark = tone === "dark";

  const update = (field: keyof Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submission: Fields = { ...values, product };
    const nextErrors = validate(submission);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setValues(empty);
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = cn(
    "w-full border-b bg-transparent px-0 py-3 text-[0.9375rem] transition-colors duration-300 outline-none",
    dark
      ? "border-cream-100/20 text-cream-100 placeholder:text-cream-200/35 focus:border-bronze-400"
      : "border-ink-900/20 text-ink-900 placeholder:text-ink-700/40 focus:border-bronze-600",
  );

  const labelClass = cn(
    "text-[0.6875rem] tracking-[0.22em] uppercase",
    dark ? "text-cream-200/60" : "text-ink-700/70",
  );

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easePremium }}
        className={cn(
          "flex flex-col items-start gap-6 border p-10 lg:p-14",
          dark ? "border-bronze-500/30 bg-ink-900" : "border-ink-900/12 bg-cream-100",
        )}
        role="status"
        aria-live="polite"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bronze-500/50 text-bronze-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h3 className={cn("font-display text-3xl", dark ? "text-cream-100" : "text-ink-900")}>
            Enquiry received
          </h3>
          <p className={cn("mt-4 max-w-md leading-relaxed", dark ? "text-cream-200/70" : "text-ink-700/80")}>
            Thank you. Our export team will review your requirement and reply to
            the email address you provided, usually within one business day. For
            anything urgent, message us on WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href={whatsappLink(
              company.contact.whatsappNumber,
              "Hello, I have just submitted an enquiry through your website.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-bronze-500/45 px-6 py-3 text-[0.8125rem] font-medium tracking-wide text-bronze-300 transition-colors hover:bg-bronze-500/10"
          >
            Message on WhatsApp
          </a>
          <Button variant={dark ? "outline" : "light"} onClick={() => setStatus("idle")}>
            Send another enquiry
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Field
        id={`${formId}-name`}
        label="Name"
        required
        error={errors.name}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={update("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={fieldClass}
          placeholder="Full name"
        />
      </Field>

      <Field
        id={`${formId}-companyName`}
        label="Company name"
        required
        error={errors.companyName}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-companyName`}
          name="companyName"
          type="text"
          autoComplete="organization"
          value={values.companyName}
          onChange={update("companyName")}
          aria-invalid={Boolean(errors.companyName)}
          aria-describedby={errors.companyName ? `${formId}-companyName-error` : undefined}
          className={fieldClass}
          placeholder="Registered company"
        />
      </Field>

      <Field
        id={`${formId}-email`}
        label="Email"
        required
        error={errors.email}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={fieldClass}
          placeholder="name@company.com"
        />
      </Field>

      <Field
        id={`${formId}-phone`}
        label="Phone / WhatsApp"
        required
        error={errors.phone}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={update("phone")}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
          className={fieldClass}
          placeholder="Include country code"
        />
      </Field>

      <Field
        id={`${formId}-country`}
        label="Country"
        required
        error={errors.country}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-country`}
          name="country"
          type="text"
          autoComplete="country-name"
          value={values.country}
          onChange={update("country")}
          aria-invalid={Boolean(errors.country)}
          aria-describedby={errors.country ? `${formId}-country-error` : undefined}
          className={fieldClass}
          placeholder="Destination country"
        />
      </Field>

      <Field
        id={`${formId}-product`}
        label="Product interested in"
        required
        error={errors.product}
        labelClass={labelClass}
        dark={dark}
      >
        <select
          id={`${formId}-product`}
          name="product"
          value={product}
          onChange={update("product")}
          aria-invalid={Boolean(errors.product)}
          aria-describedby={errors.product ? `${formId}-product-error` : undefined}
          className={cn(fieldClass, "appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-6")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c08a4e' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" className="bg-ink-900">
            Select a product
          </option>
          {productOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink-900">
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={`${formId}-quantity`}
        label="Quantity required"
        required
        error={errors.quantity}
        labelClass={labelClass}
        dark={dark}
      >
        <input
          id={`${formId}-quantity`}
          name="quantity"
          type="text"
          value={values.quantity}
          onChange={update("quantity")}
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? `${formId}-quantity-error` : undefined}
          className={fieldClass}
          placeholder="e.g. 1 x 20ft container, 5 MT"
        />
      </Field>

      <Field
        id={`${formId}-packaging`}
        label="Preferred packaging"
        labelClass={labelClass}
        dark={dark}
      >
        <select
          id={`${formId}-packaging`}
          name="packaging"
          value={values.packaging}
          onChange={update("packaging")}
          className={cn(fieldClass, "appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-6")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c08a4e' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" className="bg-ink-900">
            No preference
          </option>
          {packagingOptions.map((option) => (
            <option key={option} value={option} className="bg-ink-900">
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={`${formId}-message`}
        label="Message"
        className="sm:col-span-2"
        labelClass={labelClass}
        dark={dark}
      >
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          value={values.message}
          onChange={update("message")}
          className={cn(fieldClass, "resize-y")}
          placeholder="Grade, destination port, shipment timing, or anything else we should know"
        />
      </Field>

      <div className="sm:col-span-2">
        <AnimatePresence>
          {status === "error" ? (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className={cn(
                "mb-5 border-l-2 pl-4 text-sm",
                dark ? "border-red-400/70 text-red-300" : "border-red-700/60 text-red-700",
              )}
            >
              Something went wrong sending your enquiry. Please try again, or email
              us directly at {company.contact.email}.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-6">
          <Button
            type="submit"
            size="lg"
            variant={dark ? "primary" : "light"}
            withArrow={status !== "submitting"}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Request a Quote"}
          </Button>
          <p className={cn("text-xs leading-relaxed", dark ? "text-muted-dark" : "text-muted-light")}>
            Your details are used only to respond to this enquiry.
          </p>
        </div>
      </div>
    </form>
  );
};

const Field = ({
  id,
  label,
  required = false,
  error,
  children,
  className,
  labelClass,
  dark,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  labelClass: string;
  dark: boolean;
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label htmlFor={id} className={labelClass}>
      {label}
      {required ? (
        <span
          className={cn("ml-1", dark ? "text-bronze-300" : "text-bronze-700")}
          aria-hidden="true"
        >
          *
        </span>
      ) : (
        <span className={cn("ml-2 normal-case", dark ? "text-muted-dark" : "text-muted-light")}>
          (optional)
        </span>
      )}
    </label>
    {children}
    {error ? (
      <p
        id={`${id}-error`}
        role="alert"
        className={cn("text-xs", dark ? "text-red-300" : "text-red-700")}
      >
        {error}
      </p>
    ) : null}
  </div>
);
