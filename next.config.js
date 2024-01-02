/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "t3.gstatic.com" }],
  },
};

export default config;
