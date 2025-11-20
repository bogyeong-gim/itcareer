/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_ENABLE_AI_TUTOR: process.env.NEXT_PUBLIC_ENABLE_AI_TUTOR || 'true',
    NEXT_PUBLIC_ENABLE_ROADMAP_GENERATION: process.env.NEXT_PUBLIC_ENABLE_ROADMAP_GENERATION || 'true',
  },
  // 빌드 최적화
  swcMinify: true,
  // 프로덕션 빌드 최적화
  productionBrowserSourceMaps: false,
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // 컴파일러 옵션
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // 실험적 기능 (성능 개선)
  experimental: {
    optimizeCss: true,
  },
  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    // 프로덕션 빌드 최적화
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;


