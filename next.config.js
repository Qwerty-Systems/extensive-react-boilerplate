/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
  experimental: {
    optimizePackageImports: [
      "i18next",
      "react-i18next",
      "i18next-browser-languagedetector",
    ],
    workerThreads: true,
  },
  compress: false, // Disable for better memory analysis
  webpack: (config) => {
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!i18next|react-i18next)/],
    };
    return config;
  },
};

module.exports = nextConfig;
