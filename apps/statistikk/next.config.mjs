/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  cacheLife: {
    daily: {
      stale: 3600, // serve stale for 1 hour
      revalidate: 21600, // revalidate in background every 6 hours
      expire: 86400, // hard expire after 24 hours
    },
  },
  async rewrites() {
    return [
      {
        source: "/:sf(25\\d{2})\\-short\\.json",
        destination: `https://lg3wcd5gxfh37h0h.public.blob.vercel-storage.com/sf-data/v1/:sf-short.json`,
      },
    ];
  },
};

export default nextConfig;
