import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    // Pages légales : en `noindex` tant qu'elles ne sont pas complétées (voir lib/legal.ts).
    { url: `${site.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/politique-de-confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
