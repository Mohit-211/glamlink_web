import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ApiImage from "@/components/common/ApiImage";
import SaveProductButton from "@/components/shop/SaveProductButton";
import { formatPrice } from "@/lib/format";
import { productHref } from "@/lib/routes";
import { productButtonLabel, type ProductCard } from "@/lib/api/types";

interface ProductTileProps {
  product: ProductCard;
  priority?: boolean;
  /** Image sizes for this grid; defaults to a 4-column grid. */
  sizes?: string;
  /** Extra attributes for the link, e.g. a profile page's click tracking. */
  linkData?: Record<string, string>;
  /** The product's own button under the card ("Shop now" unless renamed), straight to the seller: the Shop's grid. */
  shopButton?: boolean;
}

/**
 * A product card: packshot, brand and category, name and price, linking to the product page; its tag top-left, a
 * heart to save it, and on the Shop its button to the seller.
 */
export default function ProductTile({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  linkData,
  shopButton = false,
}: ProductTileProps) {
  const brand = product.brand_profile?.name || product.brand;
  const price = formatPrice(product.price);
  const kicker = [brand, product.category].filter(Boolean).join(" · ");

  return (
    // The heart and the button sit beside the link, not in it: a control inside a link is invalid
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-medium">
      <Link href={productHref(product)} {...linkData} className="flex flex-1 flex-col">
        {/* Packshots are shown whole on a quiet surface, never cropped */}
        <div className="relative aspect-square bg-muted/40">
          <ApiImage
            src={product.cover_image}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] sm:p-6"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          {kicker && <p className="eyebrow truncate text-muted-foreground">{kicker}</p>}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-secondary md:text-base">
            {product.title}
          </h3>
          {price && <p className="mt-auto pt-2 text-sm font-semibold">{price}</p>}
        </div>
      </Link>

      {shopButton && product.link && (
        <div className="px-4 pb-4">
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full px-4 py-2.5">
            {productButtonLabel(product)}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens the seller&apos;s site)</span>
          </a>
        </div>
      )}

      {product.tag && (
        <span className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-4rem)] truncate rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
          {product.tag.name}
        </span>
      )}
      <SaveProductButton productId={product.id} title={product.title} className="absolute right-3 top-3 z-10" />
    </div>
  );
}
