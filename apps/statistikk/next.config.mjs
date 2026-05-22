/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
