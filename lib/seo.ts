import { Metadata } from 'next';
import { getListing, getListings } from '@/lib/api';

export const BASE_URL = 'https://otbozor.uz';

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
        const { data: listings } = await getListings({ limit: 50 });
        listingRoutes = listings.map((listing) => ({
            url: `${BASE_URL}/ot/${listing.id}-${listing.slug}`,
            lastModified: listing.publishedAt || new Date().toISOString(),
        }));
    } catch (error) {
        console.warn('Failed to fetch listings for sitemap, skipping dynamic routes');
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

    return [...routes, ...regionRoutes, ...listingRoutes];
}
