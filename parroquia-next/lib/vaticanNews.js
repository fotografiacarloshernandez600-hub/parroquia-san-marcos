import { XMLParser } from 'fast-xml-parser';

const VATICAN_RSS_URL = 'https://www.vaticannews.va/es.rss.xml';

// Obtiene noticias del feed de Vatican News (con caché de 1 hora vía fetch de Next.js)
export async function getVaticanNews(limit = 5) {
  try {
    const res = await fetch(VATICAN_RSS_URL, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ParroquiaSanMarcosBot/1.0)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser();
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item;
    if (!items) return [];
    const list = Array.isArray(items) ? items : [items];
    return list.slice(0, limit).map((item) => {
      const desc = String(item.description ?? '').replace(/<[^>]*>/g, '').trim();
      return {
        titulo: String(item.title ?? ''),
        link: String(item.link ?? ''),
        fecha: String(item.pubDate ?? ''),
        resumen: desc.slice(0, 220),
      };
    });
  } catch {
    return [];
  }
}
