import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: products } = await supabase.from("products").select("id, created_at");

  const productUrls = (products || []).map((p) => ({
    url: `https://hibatrahman.xyz/product/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://hibatrahman.xyz", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://hibatrahman.xyz/shop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://hibatrahman.xyz/track", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://hibatrahman.xyz/wishlist", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: "https://hibatrahman.xyz/reels", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://hibatrahman.xyz/coming-soon", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...productUrls,
  ];
}