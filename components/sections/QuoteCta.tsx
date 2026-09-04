import { LabelReveal } from "@/components/motion/LabelReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/utils";

/**
 * The close.
 *
 * Deep forest, no photograph. After the crossing the reader has seen enough
 * imagery; the last screen is quiet on purpose so the single primary control is
 * the only thing competing for attention. WhatsApp is a channel here, not a
 * rival button.
 */
export const QuoteCta = ({
  title = "Ready to source from India?",
  accentWords = ["India?"],
}: {
  title?: string;
  accentWords?: string[];
}) => (
  <section className="relative overflow-hidden bg-ink-950 py-[var(--spacing-section)]">
    {/* A single soft field of light, low and left, so the panel is not flat. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(86,107,78,0.32),transparent_66%)]"
    />

    <div className="container-x relative">
      <div className="max-w-2xl">
        <LabelReveal tone="dark">Request a quote</LabelReveal>

        <HeadingReveal
          text={title}
          accentWords={accentWords}
          accentClassName="text-bronze-300 italic"
          className="mt-7 font-display text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.08] tracking-[-0.01em] text-cream-50"
        />

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-muted-dark">
            Tell us the product, grade, quantity and destination port. We reply
            with what is available, how it will be packed and the terms we can offer.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="/contact#quote" size="lg" withArrow>
              Request a Quote
            </ButtonLink>
            <a
              href={whatsappLink(
                company.contact.whatsappNumber,
                "Hello, I would like to enquire about your export products.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8125rem] font-medium tracking-[0.12em] text-cream-200 uppercase transition-colors duration-500 hover:text-bronze-300"
            >
              Or message us on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
