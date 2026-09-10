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
 *
 * ---
 *
 * NOTHING WAS ADDED TO THE MOTION HERE, ON PURPOSE.
 *
 * The brief for this section lists "gentle scale" and "restrained image
 * movement" among the things it may use, and also says to reduce visual
 * complexity and to end on nothing dramatic. Those pull in opposite directions
 * and the second one wins: this is the last screen on the page, the chart above
 * it has already stepped the complexity down, and the correct end state for a
 * taper is stillness. There is no image to move, and adding one — or breathing
 * the light field behind the type — would be motion whose only justification is
 * that the section is quiet, which is exactly what the project rules out.
 *
 * The entrance is already a staggered text reveal into a clean control. That is
 * the "clean CTA entrance" the brief asks for; it did not need a second gesture.
 *
 * The default heading names the commodities and the state rather than the
 * country. By the time a reader is here the page has said Wayanad fourteen
 * times, and the ask is the one line that has to work for someone who arrived
 * at the footer from a search result — "Kerala" is the term a buyer sourcing
 * spices actually uses, and Wayanad is in it, so nothing is given up.
 */
export const QuoteCta = ({
  title = "Looking for pepper, coffee or cardamom from Kerala?",
  accentWords = ["Kerala?"],
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
