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
      // Rubber 合并：problem-cant-find-rubber 已并入 material-rubber（2026-09-24）。
      {
        source: "/:locale/guide/problem-cant-find-rubber",
        destination: "/:locale/guide/material-rubber",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
