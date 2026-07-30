/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    // ali-oss uses dynamic requires in its Node.js transport. Keep it as a
    // runtime dependency instead of making webpack inspect those internals.
    serverComponentsExternalPackages: ["ali-oss"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      // urllib only requires this module when an outbound proxy is enabled.
      "proxy-agent": false,
    };
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
      {
        protocol: "https",
        hostname: "**.aliyuncs.com",
      },
    ],
  },
};

module.exports = nextConfig;
