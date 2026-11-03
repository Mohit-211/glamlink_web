"use client";

import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { listHref } from "@/lib/searchParams";

interface ShopToolbarProps {
  search: string;
  /** The list's other choices (category, brand, price, sort, saved), kept by a new search. */
  keep: Record<string, string>;
}

/**
 * The Shop's search box. Without JavaScript it is a plain GET form; with it, the URL keeps only the choices in use
 * and the page stays put. The filters and sort are ListFilters, under it.
 */
export default function ShopToolbar({ search, keep }: ShopToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = String(new FormData(event.currentTarget).get("search") ?? "").trim();
    startTransition(() => router.push(listHref("/shop", { ...keep, search: typed }), { scroll: false }));
  };

  return (
    <form action="/shop" method="get" role="search" onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" aria-busy={pending}>
      {Object.entries(keep).map(([name, value]) => (value ? <input key={name} type="hidden" name={name} value={value} /> : null))}
      <div className="relative flex-1">
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="shop-search"
          name="search"
          type="search"
          defaultValue={search}
          maxLength={100}
          placeholder="Search products, brands and categories"
          className="input-glamlink rounded-full pl-11"
        />
      </div>

      <button type="submit" className="btn-primary shrink-0" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Search
      </button>
    </form>
  );
}
