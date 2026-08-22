import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { ProductDetail } from "@/components/product/ProductDetail";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ButtonLink } from "@/components/ui/Button";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { JsonLd, productJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

/** Static params keep every product page pre-rendered. */
export const generateStaticParams = () =>
  products.map((product) => ({ slug: product.slug }));

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} Exporter & Supplier`;

  return {
    title,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${title} — DJ Export`,
      description: product.description,
      url: `/products/${product.slug}`,
      type: "article",
    },
  };
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${product.category} · India`}
        title={product.name}
        accentWords={["Coffee", "Pepper", "Cardamom"]}
        description={product.description}
        slot={product.media.hero}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.shortName },
        ]}
      >
        <ButtonLink href={`/contact?product=${product.slug}#quote`} size="lg" withArrow>
          Request a Quote
        </ButtonLink>
      </PageHero>

      <ProductDetail product={product} />
      <RelatedProducts products={getRelatedProducts(product.slug)} />
      <FinalCta />

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}
