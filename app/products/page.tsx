import type { Metadata } from "next";
import SiteFooter from "@/components/sections/SiteFooter";
import ProductsBrowse from "@/components/sections/ProductsBrowse";
import { products } from "@/data/products.generated";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Products | Labex Laboratory Equipment",
  description:
    "Explore Labex's full product range — balances, mixing equipment, evaporation systems, glassware, liquid handling, and more.",
};

export default function ProductsPage() {
  // Compute per-category counts server-side (cost fields stay on server)
  const countMap: Record<string, { total: number; tierA: number }> = {};
  for (const cat of categories) {
    countMap[cat.slug] = { total: 0, tierA: 0 };
  }
  for (const p of products) {
    if (!p.active || !countMap[p.category]) continue;
    countMap[p.category].total++;
    if (p.tier === "A") countMap[p.category].tierA++;
  }

  return (
    <>
      <ProductsBrowse countMap={countMap} />
      <SiteFooter />
    </>
  );
}
