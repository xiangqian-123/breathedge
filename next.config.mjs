/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 根路径 → 默认语言（根 layout 已下沉到 [locale]，根路由用重定向处理）。
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      // Rubber 合并：problem-cant-find-rubber 已并入 material-rubber（2026-09-24）。
      {
        source: "/:locale/guide/problem-cant-find-rubber",
        destination: "/:locale/guide/material-rubber",
        permanent: true,
      },
      // Refined Metal 合并：problem-how-to-get-refined-metal 已并入 material-refined-metal（2026-10-11）。
      {
        source: "/:locale/guide/problem-how-to-get-refined-metal",
        destination: "/:locale/guide/material-refined-metal",
        permanent: true,
      },
      // 已删除的非英语言 → 对应英文页（301）。
      ...["zh-CN", "zh-TW", "ja", "ru", "de"].map((l) => ({
        source: `/${l}/:path*`,
        destination: "/en/:path*",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
