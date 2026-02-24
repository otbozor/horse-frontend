import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Shield, Eye, Truck, ShoppingCart } from 'lucide-react';
import { ListingGallery } from '@/components/listing/ListingGallery';
import { ProductDetailActions } from '@/components/product/ProductDetailActions';
import { ListingInteractions } from '@/components/listing/ListingInteractions';
import { ProductViewTracker } from './ProductViewTracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getProduct(slug: string) {
    try {
        const res = await fetch(`${API_URL}/api/products/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function getSimilarProducts(categoryId: string, currentSlug: string) {
    try {
        const res = await fetch(
            `${API_URL}/api/products?categoryId=${categoryId}&limit=5`,
            { next: { revalidate: 60 } },
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.data || []).filter((p: any) => p.slug !== currentSlug).slice(0, 4);
    } catch {
        return [];
    }
}

function formatPrice(amount: number, currency = 'UZS') {
    if (currency === 'USD') return `$${Number(amount).toLocaleString()}`;
    return `${Number(amount).toLocaleString()} so'm`;
}


export async function generateMetadata({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    if (!product) return { title: "Mahsulot topilmadi" };
    return {
        title: `${product.title} - ${formatPrice(product.priceAmount, product.priceCurrency)} | Otbozor`,
        description: product.description?.slice(0, 160) || `Otbozor.uz — ${product.title}`,
        openGraph: {
            images: product.media?.[0]?.url ? [product.media[0].url] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    if (!product) notFound();

    const similarProducts = product.category
        ? await getSimilarProducts(product.category.id, params.slug)
        : [];

    const galleryMedia = (product.media ?? []).map((m: any) => ({
        ...m,
        type: 'IMAGE' as const,
    }));

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <ProductViewTracker slug={params.slug} />

            <ProductDetailActions
                title={product.title}
                productId={product.id}
                ownerId={product.userId ?? null}
                slug={params.slug}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Left column: gallery + details */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <ListingGallery media={galleryMedia} title={product.title} />

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">

                        {/* Category badge */}
                        {product.category && (
                            <span className="inline-block text-sm text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full mb-3">
                                {product.category.name}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="mb-4">
                            <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {formatPrice(Number(product.priceAmount), product.priceCurrency)}
                            </p>
                            {product.priceCurrency === 'USD' && (
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                                    Taxminan {formatPrice(Number(product.priceAmount) * 12400)}
                                </p>
                            )}
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            {product.hasDelivery && (
                                <span className="flex items-center gap-1.5">
                                    <Truck className="w-4 h-4" />
                                    Yetkazib berish bor
                                </span>
                            )}
                            {product.viewCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {product.viewCount} ko&apos;rildi
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <hr className="my-6 border-slate-100 dark:border-slate-700" />
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">Tavsif</h3>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {product.description || "Tavsif yo'q"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column: seller card + contact */}
                {product.user && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">

                            {/* Seller info */}
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-lg overflow-hidden text-slate-600 dark:text-slate-300 flex-shrink-0">
                                        {product.user.avatarUrl ? (
                                            <img
                                                src={product.user.avatarUrl}
                                                alt={product.user.displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            product.user.displayName?.[0]?.toUpperCase() || 'S'
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                            {product.user.displayName}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {product.user.isVerified ? 'Tasdiqlangan sotuvchi' : 'Sotuvchi'}
                                        </p>
                                    </div>
                                    {product.user.isVerified && (
                                        <Shield className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
                                    )}
                                </div>
                            </div>

                            <ListingInteractions
                                telegramUsername={product.user.telegramUsername || ''}
                                phone={product.user.phone}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Similar products */}
            {similarProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        O&apos;xshash mahsulotlar
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((item: any) => (
                            <Link
                                key={item.id}
                                href={`/mahsulotlar/${item.slug}`}
                                className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                    {item.media?.[0] ? (
                                        <img
                                            src={item.media[0].thumbUrl || item.media[0].url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                            <ShoppingCart className="w-12 h-12" />
                                        </div>
                                    )}
                                    {item.hasDelivery && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                            Yetkazib berish
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    {item.category && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                                            {item.category.name}
                                        </p>
                                    )}
                                    <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                        {item.title}
                                    </h3>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">
                                        {formatPrice(Number(item.priceAmount), item.priceCurrency)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
