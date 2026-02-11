'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader2, Search, X, Plus } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    stockStatus: string;
    hasDelivery: boolean;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    media: Array<{
        url: string;
        thumbUrl?: string;
    }>;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filters
    const [searchQ, setSearchQ] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [hasDelivery, setHasDelivery] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, page, hasDelivery]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/categories`);
            if (!res.ok) return;
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch {
            setCategories([]);
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
            });

            if (selectedCategory) params.append('categoryId', selectedCategory);
            if (searchQ.trim()) params.append('q', searchQ.trim());
            if (priceMin) params.append('priceMin', priceMin);
            if (priceMax) params.append('priceMax', priceMax);
            if (hasDelivery) params.append('hasDelivery', 'true');

            const res = await fetch(`${API_URL}/api/products?${params}`);
            if (!res.ok) { setProducts([]); setTotalPages(1); setTotal(0); return; }

            const data = await res.json();
            setProducts(Array.isArray(data.data) ? data.data : []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotal(data.pagination?.total || 0);
        } catch {
            setProducts([]);
            setTotalPages(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, page, searchQ, priceMin, priceMax, hasDelivery, API_URL]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handlePriceFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const resetFilters = () => {
        setSelectedCategory(null);
        setSearchQ('');
        setPriceMin('');
        setPriceMax('');
        setHasDelivery(false);
        setPage(1);
    };

    const hasActiveFilters = selectedCategory || searchQ || priceMin || priceMax || hasDelivery;

    const formatPrice = (amount: number, currency: string = 'UZS') => {
        if (currency === 'USD') return `$${amount.toLocaleString()}`;
        return `${amount.toLocaleString()} so'm`;
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">Ot uchun mahsulotlar</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Sifatli egar-jabduqlar, ozuqa va aksessuarlar</p>
                </div>
                <Link
                    href="/mahsulot/yaratish"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Mahsulot joylash
                </Link>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Mahsulot qidirish..."
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                {searchQ && (
                    <button
                        type="button"
                        onClick={() => { setSearchQ(''); setPage(1); }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Izla
                </button>
            </form>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-24 space-y-6">

                        {/* Active filters reset */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700"
                            >
                                <X className="w-4 h-4" />
                                Filtrlarni tozalash
                            </button>
                        )}

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">Kategoriyalar</h3>
                            <ul className="space-y-1">
                                <li>
                                    <button
                                        onClick={() => { setSelectedCategory(null); setPage(1); }}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${!selectedCategory
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                                            }`}
                                    >
                                        Barchasi
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                                            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedCategory === cat.id
                                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                                                }`}
                                        >
                                            {cat.name}
                                            {cat._count && cat._count.products > 0 && (
                                                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                                                    ({cat._count.products})
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">Narx (so&apos;m)</h3>
                            <form onSubmit={handlePriceFilter} className="space-y-2">
                                <input
                                    type="number"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    placeholder="Dan"
                                    min={0}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                                <input
                                    type="number"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    placeholder="Gacha"
                                    min={0}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Qo&apos;llash
                                </button>
                            </form>
                        </div>

                        {/* Delivery toggle */}
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wide">Yetkazib berish</h3>
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <div
                                    onClick={() => { setHasDelivery((v) => !v); setPage(1); }}
                                    className={`relative w-10 h-6 rounded-full transition-colors ${hasDelivery ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-600'}`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasDelivery ? 'translate-x-4' : 'translate-x-0'}`}
                                    />
                                </div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Faqat yetkazib beriladiganlar</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-grow">
                    {/* Results count */}
                    {!loading && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            {total} ta mahsulot topildi
                        </p>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <ShoppingCart className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Mahsulotlar topilmadi</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    Filtrlarni tozalash
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/mahsulotlar/${product.slug}`}
                                        className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
                                    >
                                        <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                            {product.media[0] ? (
                                                <img
                                                    src={product.media[0].thumbUrl || product.media[0].url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                    <ShoppingCart className="w-16 h-16" />
                                                </div>
                                            )}
                                            {product.stockStatus === 'OUT_OF_STOCK' && (
                                                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center">
                                                    <span className="bg-slate-800 text-white px-3 py-1 rounded text-sm font-medium">
                                                        Sotuvda yo&apos;q
                                                    </span>
                                                </div>
                                            )}
                                            {product.hasDelivery && (
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                                    Yetkazib berish
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            {product.category && (
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{product.category.name}</p>
                                            )}
                                            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                {product.title}
                                            </h3>
                                            <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                                {formatPrice(Number(product.priceAmount), product.priceCurrency)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Oldingi
                                    </button>
                                    <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                                        {page} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Keyingi
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
