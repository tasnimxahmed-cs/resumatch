// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Webpack configuration to handle pdf-parse properly
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pdf-parse dependencies on server side
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse'
      });
    }
    
    return config;
  },
};

export default nextConfig;