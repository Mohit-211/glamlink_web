import { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { getTypeBlogs } from "@/api/Api";
import { decodeId } from "@/lib/idCodec";
import ShareProductButton from "@/components/blogs/ShareProductButton";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://glamlink.net";

async function getProduct(encodedId: string) {
  const decodedId = decodeId(encodedId);

  let products: any[] = [];
  try {
    const res = await getTypeBlogs("shop");
    products = res?.data?.rows || res || [];
  } catch (error) {
    console.error("Failed to fetch shop products:", error);
  }

  return products.find((p: any) => String(p.id) === decodedId) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found | Glamlink" };
  }

  const title = product.title || product.name;
  const productUrl = `${SITE_URL}/journal/shop/${id}`;

  return {
    title: `${title} | Glamlink Shop`,
    description: product.description || product.short_description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: product.description || product.short_description,
      url: productUrl,
      images: product.cover_image ? [{ url: product.cover_image }] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const productUrl = `${SITE_URL}/journal/shop/${id}`;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          This product may have been removed or the link is invalid.
        </p>
        <Link
          href="/journal/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <Link
          href="/journal/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid sm:grid-cols-2 gap-10 sm:gap-14">
          {/* Image side */}
          <div className="relative aspect-square rounded-2xl bg-muted/30 overflow-hidden border border-border/40">
            <img
              src={product.cover_image}
              alt={product.title || product.name}
              className="w-full h-full object-cover"
            />

            {product.category && (
              <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-foreground px-2.5 py-1 rounded">
                {product.category}
              </span>
            )}
          </div>

          {/* Details side */}
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
              {product.brand}
            </p>

            <h1 className="font-display text-3xl leading-snug mt-2 text-foreground">
              {product.title || product.name}
            </h1>

            {(product.description || product.short_description) && (
              <p className="text-sm text-muted-foreground leading-relaxed mt-5">
                {product.description || product.short_description}
              </p>
            )}

            <div className="mt-auto pt-10 space-y-4">
              <div className="h-px bg-border/60" />

              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-foreground">
                  {product.price ? `$${product.price}` : "View Product"}
                </span>

                <div className="flex items-center gap-2">
                  <ShareProductButton
                    url={productUrl}
                    title={product.title || product.name}
                  />

                  {product.link && (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
