/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://resume-builder-eight-eta.vercel.app/",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/auth/*"],
  transform: async (config, path) => {
    return {
      loc: path, // e.g. "/about"
      changefreq: "weekly",
      priority: path === "/" ? 1.0 : path.startsWith("/dashboard") ? 0.5 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
