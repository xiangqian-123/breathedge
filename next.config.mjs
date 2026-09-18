/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 根路径 → 默认语言（根 layout 已下沉到 [locale]，根路由用重定向处理）。
  async redirects() {
    return [
      {
        source: "/",
        destination: "/zh-CN",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
