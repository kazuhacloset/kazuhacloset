/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://www.kazuhacloset.com", // your live domain (no trailing slash at end)
  generateRobotsTxt: true,                // ✅ generates robots.txt
  changefreq: "daily",                    // Google crawl frequency
  priority: 0.7,                          // Page importance (0–1)
  sitemapSize: 7000,
  generateIndexSitemap: true,

  // ❌ Don’t index sensitive/private pages
  exclude: [
    "/login",
    "/register",
    "/forgot-password",
    "/profile",
    "/cart",
  ],

  // ✅ Robots.txt rules
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/cart", "/profile"] },
    ],
    additionalSitemaps: [
      "https://www.kazuhacloset.com/sitemap.xml",
    ],
  },
};

module.exports = config;
