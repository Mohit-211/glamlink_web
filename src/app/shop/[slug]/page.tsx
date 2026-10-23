import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ExternalLink, ShoppingBag } from "lucide-react";
import slugify from "slugify";
import ApiImage from "@/components/common/ApiImage";
import JsonLd from "@/components/content/JsonLd";
import ProductTile from "@/components/content/ProductTile";
import SectionHeading from "@/components/content/SectionHeading";
import ShareProductButton from "@/components/blogs/ShareProductButton";
import { getProductById, getProductBySlug, getProducts } from "@/lib/api/public";
import type { ProductCard, ProductDetail } from "@/lib/api/types";
import { SITE_URL } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { decodeId } from "@/lib/idCodec";
import { productHref, profileHref, topicHref } from "@/lib/routes";

type Params = Promise<{ slug: string }>;

/**
 * A product by its slug. Links from before products had slugs carry the
 * product's encoded id (/shop/MzE): those still open, and move to the slug
 * once the product has one.
 */
async function loadProduct(slug: string): Promise<{ product: ProductDetail; legacy: boolean } | null> {
  const bySlug = await getProductBySlug(slug);
  if (bySlug) return { product: bySlug, legacy: false };

  const id = decodeId(slug);
  if (/^\d+$/.test(id)) {
    const byId = await getProductById(id);
    if (byId) return { product: byId, legacy: true };
  }
  return null;
}

const brandOf = (product: ProductCard) => product.brand_profile?.name || product.brand || "";

/** Same brand: the same brand page, or the same brand text when there is no page. */
function sameBrand(a: ProductCard, b: ProductCard) {
  if (a.brand_profile && b.brand_profile) return a.brand_profile.id === b.brand_profile.id;
  return Boolean(a.brand && b.brand && a.brand.trim().toLowerCase() === b.brand.trim().toLowerCase());
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadProduct(slug);
  if (!found) return { title: "Product not found" };

  const { product } = found;
  const brand = brandOf(product);
  const url = `${SITE_URL}${productHref(product)}`;
  const description = product.short_description || product.description || undefined;

  return {
    title: brand ? `${product.title} by ${brand}` : product.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.title,
      description,
      url,
      images: product.cover_image ? [{ url: product.cover_image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const found = await loadProduct(slug);
  if (!found) notFound();

  const { product, legacy } = found;
  if (legacy && product.slug) permanentRedirect(productHref(product));

  const brand = brandOf(product);
  const brandProfile = product.brand_profile ?? null;
  const owner = product.owner && product.owner.id !== brandProfile?.id ? product.owner : null;
  const price = formatPrice(product.price);
  const url = `${SITE_URL}${productHref(product)}`;
  const topics = product.topics ?? product.journal_topics ?? [];
  const description = product.description || product.short_description || "";
  const paragraphs = description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const categorySlug = product.category ? slugify(product.category, { lower: true, strict: true }) : "";

  const brandQuery = brandProfile?.slug || (product.brand ? slugify(product.brand, { lower: true, strict: true }) : "");
  const more = brandQuery
    ? (await getProducts({ brand: brandQuery, limit: 5 })).rows
        .filter((p) => p.id !== product.id && sameBrand(p, product))
        .slice(0, 4)
    : [];

  return (
    <div className="container-glamlink pb-20 pt-24 md:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          url,
          image: product.cover_image ? [product.cover_image] : undefined,
          description: product.short_description || undefined,
          brand: brand ? { "@type": "Brand", name: brand } : undefined,
          offers:
            price && product.link
              ? { "@type": "Offer", price: Number(product.price).toFixed(2), priceCurrency: "USD", url: product.link }
              : undefined,
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/shop" className="transition-colors hover:text-secondary">
              Shop
            </Link>
          </li>
          {product.category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/shop?category=${categorySlug}`} className="transition-colors hover:text-secondary">
                  {product.category}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="max-w-[60vw] truncate text-foreground">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted/40">
          <ApiImage
            src={product.cover_image}
            alt={product.title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-8 md:p-12"
          />
        </div>

        <div className="flex flex-col">
          {brand &&
            (brandProfile ? (
              <Link href={profileHref(brandProfile.slug)} className="eyebrow self-start hover:text-secondary">
                {brand}
              </Link>
            ) : (
              <p className="eyebrow">{brand}</p>
            ))}
          <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{product.title}</h1>
          {price && <p className="mt-4 text-2xl font-semibold">{price}</p>}

          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {paragraphs.map((text, i) => (
                <p key={i} className="whitespace-pre-line">
                  {text}
                </p>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {product.link && (
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Shop Now
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">(opens the seller&apos;s site)</span>
              </a>
            )}
            <ShareProductButton url={url} title={product.title} />
          </div>

          {owner && (
            <p className="mt-6 text-sm text-muted-foreground">
              Recommended by{" "}
              <Link href={profileHref(owner.slug)} className="link-glamlink">
                {owner.name}
              </Link>
            </p>
          )}

          {topics.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="eyebrow">Related topics</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <Link href={topicHref(topic)} className="chip inline-flex rounded-full px-3.5 py-1.5 text-sm">
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more-products-heading" className="mt-16 md:mt-24">
          <SectionHeading
            id="more-products-heading"
            title={`More from ${brand}`}
            action={{ label: "See all", href: `/shop?brand=${encodeURIComponent(brandQuery)}` }}
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {more.map((item) => (
              <li key={item.id}>
                <ProductTile product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
