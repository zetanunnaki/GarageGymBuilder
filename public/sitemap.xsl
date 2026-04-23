<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html>
<head>
<title>Sitemap — GarageGymBuilders</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; background: #0a0a0a; color: #d4d4d8; }
  h1 { color: #ea580c; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; }
  p.meta { color: #71717a; font-size: 0.8rem; margin-bottom: 1.5rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
  th { text-align: left; padding: 0.6rem 0.8rem; background: #18181b; color: #ea580c; font-weight: 700; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.1em; border-bottom: 2px solid #ea580c; }
  td { padding: 0.5rem 0.8rem; border-bottom: 1px solid #27272a; }
  tr:hover td { background: #18181b; }
  a { color: #d4d4d8; text-decoration: none; }
  a:hover { color: #ea580c; }
  .priority { text-align: center; }
  .freq { text-align: center; color: #71717a; }
  .date { color: #a1a1aa; }
  .img-badge { display: inline-block; background: #ea580c; color: #000; font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }
</style>
</head>
<body>
<h1>Sitemap</h1>
<p class="meta">
  <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
</p>
<table>
  <tr>
    <th>URL</th>
    <th>Priority</th>
    <th>Frequency</th>
    <th>Last Modified</th>
  </tr>
  <xsl:for-each select="sitemap:urlset/sitemap:url">
    <tr>
      <td>
        <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
        <xsl:if test="image:image">
          <xsl:text> </xsl:text><span class="img-badge">IMG</span>
        </xsl:if>
      </td>
      <td class="priority"><xsl:value-of select="sitemap:priority"/></td>
      <td class="freq"><xsl:value-of select="sitemap:changefreq"/></td>
      <td class="date"><xsl:value-of select="sitemap:lastmod"/></td>
    </tr>
  </xsl:for-each>
</table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
