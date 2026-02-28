import { generateSitemap } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
    return generateSitemap();
}
