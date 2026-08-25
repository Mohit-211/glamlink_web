"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 3;

interface ProductCardProps {
  product: any;
  onSelect: (product: any) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
console.log(product,"products")
  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col h-full border border-border/50 rounded-xl overflow-hidden bg-background shadow-sm hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-[5/5.5] bg-muted/30 overflow-hidden">
        <img
          src={product.cover_image}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {product.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-foreground px-2 py-1 rounded">
            {product.category}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>

        <h3 className="font-display text-sm md:text-base leading-snug group-hover:text-primary transition-colors">
          {product.title || product.name}
        </h3>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-base font-semibold">
            {product.price ? `$${product.price}` : "View Product"}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              product.link && window.open(product.link, "_blank");
            }}
            className="rounded-full text-xs border-primary/40 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            <ShoppingBag className="h-3 w-3 mr-1.5" />
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
}

const JournalShopCard = ({ shop,heading }: JournalShopCardProps) => {
  console.log(shop,"shop")
  const products = shop ?? [];
  const [activeProduct, setActiveProduct] = useState<any>(null);
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

  return (
    <section className="space-y-8">
      {/* Header */}
      {heading==="yes"&&
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
          Curated Picks
        </p>

        <h1 className="font-display text-2xl md:text-3xl tracking-tight">
          Shop The Journal
        </h1>

        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Products featured in our articles, handpicked by the Glamlink
          editorial team.
        </p>
      </div>
}
      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={setActiveProduct}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
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

      {/* Product Modal */}
      <Dialog
        open={!!activeProduct}
        onOpenChange={(open) => !open && setActiveProduct(null)}
      >
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl border-none shadow-[var(--shadow-large)]">
          {activeProduct && (
            <>
              {/* Accessible title (visually replaced by custom header below) */}
              <DialogHeader className="sr-only">
                <DialogTitle>
                  {activeProduct.title || activeProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid sm:grid-cols-2">
                {/* Image side */}
                <div className="relative aspect-square sm:aspect-auto bg-muted/30 overflow-hidden">
                  <img
                    src={activeProduct.cover_image}
                    alt={activeProduct.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle gradient for legibility on small screens */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent sm:hidden" />

                  {activeProduct.category && (
                    <span className="badge-soft absolute top-4 left-4 !bg-white/90 !border-white/60 !text-foreground backdrop-blur-sm shadow-sm">
                      {activeProduct.category}
                    </span>
                  )}
                </div>

                {/* Details side */}
                <div className="flex flex-col p-6 sm:p-8 bg-card">
                  <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">
                    {activeProduct.brand}
                  </p>

                  <h2 className="font-display text-2xl leading-snug mt-1.5 text-foreground">
                    {activeProduct.title || activeProduct.name}
                  </h2>

                  {(activeProduct.description || activeProduct.short_description) && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                      {activeProduct.description || activeProduct.short_description}
                    </p>
                  )}

                  <div className="mt-auto pt-8 space-y-4">
                    <div className="h-px bg-border/60" />

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-foreground">
                        {activeProduct.price
                          ? `$${activeProduct.price}`
                          : "View Product"}
                      </span>

                      <Button
                        onClick={() =>
                          activeProduct.link &&
                          window.open(activeProduct.link, "_blank")
                        }
                        className="btn-primary cursor-pointer"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default JournalShopCard;
