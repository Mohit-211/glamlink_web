"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { encodeId } from "@/lib/idCodec";

const PRODUCTS_PER_PAGE = 3;

interface ProductCardProps {
  product: any;
  onSelect: (product: any) => void;
  compact?: boolean;
}

// `compact` tightens the card below the sm breakpoint (3-up mobile grid on the
// Shop page) and clamps names to 2 lines; sm and up keep the original sizing.
const COMPACT_CLASSES = {
  card: "rounded-lg sm:rounded-xl",
  badge:
    "top-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate text-[8px] px-1.5 py-0.5 sm:top-3 sm:left-3 sm:max-w-none sm:text-[10px] sm:px-2 sm:py-1",
  body: "p-2 space-y-1 sm:p-4 sm:space-y-2",
  brand: "text-[8px] truncate sm:text-[10px]",
  title: "text-xs sm:text-sm md:text-base line-clamp-2",
  footer:
    "flex flex-col items-stretch gap-1.5 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:pt-2",
  price: "text-xs sm:text-base",
  button: "w-full px-2 text-[10px] sm:w-auto sm:px-3 sm:text-xs",
  icon: "mr-1 sm:mr-1.5",
};

const DEFAULT_CLASSES = {
  card: "rounded-xl",
  badge: "top-3 left-3 text-[10px] px-2 py-1",
  body: "p-4 space-y-2",
  brand: "text-[10px]",
  title: "text-sm md:text-base",
  footer: "flex items-center justify-between pt-2",
  price: "text-base",
  button: "text-xs",
  icon: "mr-1.5",
};

const ProductCard = ({ product, onSelect, compact = false }: ProductCardProps) => {
  const c = compact ? COMPACT_CLASSES : DEFAULT_CLASSES;
  const name = product.title || product.name;

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group flex flex-col h-full border border-border/50 ${c.card} overflow-hidden bg-background shadow-sm hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
    >
      <div className="relative aspect-[5/5.5] bg-muted/30 overflow-hidden">
        <img
          src={product.cover_image}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {product.category && (
          <span className={`absolute ${c.badge} font-semibold uppercase tracking-wide bg-white/90 text-foreground rounded`}>
            {product.category}
          </span>
        )}
      </div>

      <div className={`${c.body} flex flex-col flex-1`}>
        <p className={`${c.brand} uppercase tracking-widest text-muted-foreground`}>
          {product.brand}
        </p>

        <h3
          title={compact ? name : undefined}
          className={`font-display ${c.title} leading-snug group-hover:text-primary transition-colors`}
        >
          {name}
        </h3>

        <div className={`${c.footer} mt-auto`}>
          <span className={`${c.price} font-semibold`}>
            {product.price ? `$${product.price}` : "View Product"}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              product.link && window.open(product.link, "_blank");
            }}
            className={`rounded-full ${c.button} border-primary/40 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer`}
          >
            <ShoppingBag className={`h-3 w-3 ${c.icon}`} />
            Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

interface JournalShopCardProps {
  shop?: any[];
  heading:string
  compact?: boolean;
}

const JournalShopCard = ({ shop,heading, compact = false }: JournalShopCardProps) => {
  const router = useRouter();
  const products = shop ?? [];
  const [currentPage, setCurrentPage] = useState(1);

  if (products.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const goToProductDetails = (product: any) => {
    router.push(`/journal/shop/${encodeId(product.id)}`);
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      {heading==="yes"&&
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
          Curated Picks
        </p>

        <h2 className="font-display text-2xl md:text-3xl tracking-tight">
          Shop The Journal
        </h2>

        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Products featured in our articles, handpicked by the Glamlink
          editorial team.
        </p>
      </div>
}
      {/* Grid */}
      <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${compact ? "grid-cols-3 gap-2 sm:gap-6" : "gap-6"}`}>
        {paginatedProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={goToProductDetails}
            compact={compact}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          {/* flex-wrap only kicks in when page links don't fit (narrow phones) */}
          <PaginationContent className={compact ? "flex-wrap justify-center" : undefined}>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default JournalShopCard;
