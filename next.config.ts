import type { NextConfig } from "next";

/**
 *   npm run build         Vercel. Image optimisation on.
 *   npm run build:static  Plain HTML in ./out for any web host.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Cache Components and Partial Prefetching are the new create-next-app
  // defaults, but PPR cannot be enabled in export mode - so the plain-HTML
  // build turns them off. This site fetches nothing, so it loses nothing.
  cacheComponents: !isStatic,
  partialPrefetching: !isStatic,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  ...(isStatic
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {
        images: { formats: ["image/avif" as const, "image/webp" as const] },
        async headers() {
          // Mockup: keep it out of search engines so it cannot compete
          // with the live jurassicseafarms.co.uk.
          return [
            {
              source: "/:path*",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ];
        },
      }),
};

export default nextConfig;
