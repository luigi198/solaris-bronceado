/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://solarisbronceado.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 1.0,
  autoLastmod: true,
  // Home stays at 1.0; secondary routes (e.g. /blog) rank below it.
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: path === "/" ? 1.0 : 0.7,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  }),
};
