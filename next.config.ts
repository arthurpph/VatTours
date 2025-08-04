import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         new URL('https://i.imgur.com/**'),
         new URL('https://localhost:8080/**'),
      ],
   },
};

export default nextConfig;
