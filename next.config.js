/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'jeqqjtfiieojjhwvqeew.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
