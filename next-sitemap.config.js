/** @type {import('next-sitemap').IConfig} */
// Keep in sync with SITE_URL in src/lib/constants.ts (Vercel's primary domain).
const SITE_URL = "https://www.solarisbronceado.com";

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 1.0,
  // Build time is not a content change; a lastmod that moves on every deploy
  // teaches Google to ignore it.
  autoLastmod: false,
  // /blog and its posts live in the dynamic /blog/sitemap.xml (src/app/(site)/blog/sitemap.ts),
  // which updates on publish; the admin must never be listed.
  exclude: ["/admin", "/admin/*", "/blog", "/blog/*"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    additionalSitemaps: [`${SITE_URL}/blog/sitemap.xml`],
  },
  // Home stays at 1.0; any other static route ranks below it.
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: path === "/" ? 1.0 : 0.7,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  }),
};
