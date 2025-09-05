/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.kazuhacloset.com',
  generateRobotsTxt: true, // will auto create sitemap.xml + robots.txt
  exclude: ['/profile', '/cart', '/order-summary'], // pages you don’t want indexed
};
