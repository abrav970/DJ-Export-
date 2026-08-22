import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="This page could not be found"
      accentWords={["found"]}
      description="The page you were looking for has moved or no longer exists. Our product range and enquiry form are a click away."
      slot="landscape"
      crumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
    >
      <div className="flex flex-wrap gap-4">
        <ButtonLink href="/products" size="lg" withArrow>
          Explore Our Products
        </ButtonLink>
        <ButtonLink href="/contact#quote" variant="outline" size="lg">
          Request a Quote
        </ButtonLink>
      </div>
    </PageHero>
  );
}
