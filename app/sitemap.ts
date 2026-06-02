import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products.generated";

const BASE_URL = "https://labex.co.za";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/products/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Product detail pages (Tier A + B only — Tier C has no detail page)
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.tier !== "C" && p.active)
    .map((p) => ({
      url: `${BASE_URL}/products/${p.category}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.tier === "A" ? 0.7 : 0.5,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}
