import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hibatrahman.xyz", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://hibatrahman.xyz/shop", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://hibatrahman.xyz/reels", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://hibatrahman.xyz/wishlist", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: "https://hibatrahman.xyz/track", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://hibatrahman.xyz/coming-soon", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}