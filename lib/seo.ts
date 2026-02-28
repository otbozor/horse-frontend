import { getListings } from '@/lib/api';

export const BASE_URL = 'https://otbozor.uz';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateSitemap() {
    // Static pages
    const routes = [
        '',
        '/bozor',
        '/blog',
        '/kopkari',
        '/mahsulotlar',
        '/aloqa',
        '/faq',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString(),
    }));

    // Dynamic Listings
    let listingRoutes: any[] = [];
    try {
        const { data: listings } = await getListings({ limit: 500 });
        listingRoutes = listings.map((listing) => ({
            url: `${BASE_URL}/ot/${listing.id}-${listing.slug}`,
            lastModified: listing.publishedAt || new Date().toISOString(),
        }));
    } catch {
        console.warn('Failed to fetch listings for sitemap');
    }

    // Blog posts
    let blogRoutes: any[] = [];
    try {
        const res = await fetch(`${API_URL}/api/blog/posts?limit=200`);
        const data = await res.json();
        const posts = data.success ? (data.data || []) : [];
        blogRoutes = posts.map((post: any) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
        }));
    } catch {
        console.warn('Failed to fetch blog posts for sitemap');
    }

    // Viloyatlar (SEO pages)
    const regions = [
        'toshkent-viloyati', 'samarqand', 'buxoro', 'fargona',
        'andijon', 'namangan', 'xorazm', 'qashqadaryo',
        'surxondaryo', 'navoiy', 'jizzax', 'sirdaryo',
        'qoraqalpogiston', 'toshkent-shahri'
    ];

    const regionRoutes = regions.map((slug) => ({
        url: `${BASE_URL}/bozor/${slug}`,
        lastModified: new Date().toISOString(),
    }));

    return [...routes, ...regionRoutes, ...listingRoutes, ...blogRoutes];
}
