/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      "i.ytimg.com",
      "moonbox.s3.ap-east-1.amazonaws.com",
      "picsum.photos",
      "www2.cs.uic.edu",
      "archive.org",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ap-east-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
