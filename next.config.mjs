import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Redirect problematic server-only/test modules to a small client-safe mock
      'thread-stream': path.resolve('./src/mocks/empty.js'),
      'pino': path.resolve('./src/mocks/empty.js'),
    };
    return config;
  },
};

export default nextConfig;
