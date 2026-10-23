import Link from "next/link";
import ApiImage from "@/components/common/ApiImage";
import { formatPrice } from "@/lib/format";
import { productHref } from "@/lib/routes";
import type { ProductCard } from "@/lib/api/types";

interface ProductTileProps {
  product: ProductCard;
  priority?: boolean;
  /** Image sizes for this grid; defaults to a 4-column grid. */
  sizes?: string;
  /** Extra attributes for the link, e.g. a profile page's click tracking. */
  linkData?: Record<string, string>;
}

/** A product card: packshot, brand, name and price, linking to the product page. */
export default function ProductTile({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  linkData,
}: ProductTileProps) {
  const brand = product.brand_profile?.name || product.brand;
  const price = formatPrice(product.price);

  return (
    <Link
      href={productHref(product)}
      {...linkData}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-medium"
    >
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
        {product.category && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {brand && (
          <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{brand}</p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-secondary md:text-[15px]">
          {product.title}
        </h3>
        {price && <p className="mt-auto pt-2 text-sm font-semibold">{price}</p>}
      </div>
    </Link>
  );
}
