"use client";

import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { listHref } from "@/lib/searchParams";
import type { ShopFilterValue } from "@/lib/api/types";

interface ShopToolbarProps {
  search: string;
  brand: string;
  category: string;
  brands: ShopFilterValue[];
}

/**
 * Search box and brand picker for /shop. Without JavaScript it is a plain GET
 * form; with it, the URL keeps only the filters in use and the page stays put.
 */
export default function ShopToolbar({ search, brand, category, brands }: ShopToolbarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const href = listHref("/shop", {
      search: String(data.get("search") ?? "").trim(),
      brand: String(data.get("brand") ?? ""),
      category,
    });
    startTransition(() => router.push(href, { scroll: false }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    go(event.currentTarget);
  };

  return (
    <form
      action="/shop"
      method="get"
      role="search"
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row"
      aria-busy={pending}
    >
      {category && <input type="hidden" name="category" value={category} />}
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

      {brands.length > 0 && (
        <div className="sm:w-60">
          <label htmlFor="shop-brand" className="sr-only">
            Brand
          </label>
          <select
            id="shop-brand"
            name="brand"
            defaultValue={brand}
            onChange={(event) => event.currentTarget.form && go(event.currentTarget.form)}
            className="input-glamlink rounded-full"
          >
            <option value="">All brands</option>
            {brands.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name} ({option.count})
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn-primary shrink-0" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Search
      </button>
    </form>
  );
}
