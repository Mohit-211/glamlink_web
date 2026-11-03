import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SITE_URL } from "@/lib/config";
import ShopPage, { PRODUCTS_PER_PAGE } from "@/components/shop/ShopPage";
import { priceBand, SAVED_SORTS, SHOP_SORTS } from "@/components/shop/shopOptions";
import { getProducts, getShopFilters } from "@/lib/api/public";
import type { Paged, ProductCard, ShopSort } from "@/lib/api/types";
import { parseSaved, SAVED_COOKIE } from "@/lib/savedProducts";
import { pageParam, param, type SearchParams } from "@/lib/searchParams";

const description =
  "Discover professional beauty + wellness products, from trusted brands to the products experts are talking about.";

export const metadata: Metadata = {
  title: "Shop Professional Beauty + Wellness Products",
  description,
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Glamlink Shop | Professional Beauty + Wellness Products",
    description,
    url: `${SITE_URL}/shop`,
  },
};

const NONE: Paged<ProductCard> = { count: 0, rows: [] };

/** The saved products in the visitor's order: an API from before Nov 3 ignores `ids` and answers every product. */
function onlySaved(list: Paged<ProductCard>, ids: number[], keepOrder: boolean): Paged<ProductCard> {
  const rows = list.rows.filter((row) => ids.includes(row.id));
  if (rows.length === list.rows.length) return list;
  if (keepOrder) rows.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  return { count: rows.length, rows };
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const search = param(params.search);
  const category = param(params.category);
  const brand = param(params.brand);
  const band = priceBand(param(params.price));
  const saved = param(params.saved) === "1";
  const sorts = saved ? SAVED_SORTS : SHOP_SORTS;
  const asked = param(params.sort);
  const sort = sorts.some((s) => s.value === asked) ? asked : sorts[0].value;
  // The Saved list is the visitor's cookie (lib/savedProducts.ts); without one there is nothing to ask for
  const savedIds = saved ? parseSaved((await cookies()).get(SAVED_COOKIE)?.value) : [];

  const [products, filters] = await Promise.all([
    saved && savedIds.length === 0
      ? NONE
      : getProducts({
          page,
          limit: PRODUCTS_PER_PAGE,
          search,
          category,
          brand,
          min_price: band?.min,
          max_price: band?.max,
          // "Recently saved" is the ids' own order
          sort: sort === "saved" ? undefined : (sort as ShopSort),
          ids: saved ? savedIds.join(",") : undefined,
        }),
    getShopFilters(),
  ]);

  return (
    <ShopPage
      products={saved ? onlySaved(products, savedIds, sort === "saved") : products}
      filters={filters}
      page={page}
      search={search}
      category={category}
      brand={brand}
      price={band?.value ?? ""}
      sort={sort}
      saved={saved}
    />
  );
}
