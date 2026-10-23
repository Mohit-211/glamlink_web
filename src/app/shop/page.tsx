import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import ShopPage, { PRODUCTS_PER_PAGE } from "@/components/shop/ShopPage";
import { getProducts, getShopFilters } from "@/lib/api/public";
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

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageParam(params.page);
  const search = param(params.search);
  const category = param(params.category);
  const brand = param(params.brand);

  const [products, filters] = await Promise.all([
    getProducts({ page, limit: PRODUCTS_PER_PAGE, search, category, brand }),
    getShopFilters(),
  ]);

  return (
    <ShopPage
      products={products}
      filters={filters}
      page={page}
      search={search}
      category={category}
      brand={brand}
    />
  );
}
