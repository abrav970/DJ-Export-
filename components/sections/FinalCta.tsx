import { Media } from "@/components/media/Media";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/utils";

export const FinalCta = () => (
  <section className="relative overflow-hidden bg-ink-950 py-28 lg:py-36">
    <div className="absolute inset-0 opacity-45">
      <Media slot="packing" sizes="100vw" idPrefix="final-cta" />
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,11,9,0.96),rgba(12,11,9,0.8)_55%,rgba(12,11,9,0.6))]"
    />

    <div className="container-x relative">
      <div className="max-w-3xl">
        <Reveal y={12}>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-bronze-500" />
            <span className="eyebrow text-bronze-300">Start here</span>
          </div>
        </Reveal>

        <HeadlineReveal
          as="h2"
          trigger="inView"
          text="Looking for a reliable Indian supplier?"
          accentWords={["supplier?"]}
          delay={0.05}
          className="mt-7 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] text-cream-50"
        />

        <Reveal delay={0.15}>
          <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.8] text-cream-200/75">
            Tell us what product and quantity you are looking for, and we will get
            back to you with the relevant information.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact#quote" size="lg" withArrow>
              Start an Enquiry
            </ButtonLink>
            <a
              href={whatsappLink(
                company.contact.whatsappNumber,
                "Hello, I would like to enquire about your export products.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-bronze-500/45 px-8 py-4 text-sm font-medium tracking-wide text-bronze-200 transition-colors duration-500 hover:border-bronze-400 hover:bg-bronze-500/10"
            >
              Message on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
