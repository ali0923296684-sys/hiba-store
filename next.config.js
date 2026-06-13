/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'jeqqjtfiieojjhwvqeew.supabase.co', // أضفنا حرف w هنا
      },
    ],
  },
}

module.exports = nextConfig