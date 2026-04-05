/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable cache entirely to prevent Windows file locking errors (UNKNOWN -4094)
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
