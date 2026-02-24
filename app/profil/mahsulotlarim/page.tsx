'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Trash2, Eye, Loader2, ArrowLeft, Plus, ShoppingCart, Pencil } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface MyProduct {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    status: string;
    stockStatus: string;
    isPaid: boolean;
    viewCount: number;
    category?: { name: string };
    media: Array<{ url: string; thumbUrl?: string }>;
    createdAt: string;
}

const STATUS_TABS = [
    { key: 'PUBLISHED', label: 'Faol' },
    { key: 'DRAFT', label: 'Kutilayotgan' },
    { key: 'ARCHIVED', label: 'Bekor qilingan' },
    { key: 'UNPAID', label: "To'lanmagan" },
];

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
    PUBLISHED: { cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Faol' },
    DRAFT: { cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', label: 'Kutilayotgan' },
    ARCHIVED: { cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', label: 'Bekor qilingan' },
};

function formatPrice(amount: number, currency: string = 'UZS') {
    if (currency === 'USD') return `$${Number(amount).toLocaleString()}`;
    return `${Number(amount).toLocaleString()} so'm`;
}

function MahsulotlarimContent() {
    const router = useRouter();
    const [products, setProducts] = useState<MyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PUBLISHED');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/my/products`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(Array.isArray(data?.data) ? data.data : []);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Mahsulotni o'chirishni xohlaysizmi?")) return;
        setDeletingId(id);
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/my/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(prev => prev.filter(p => p.id !== id));
        } finally {
            setDeletingId(null);
        }
    };

    const filteredProducts = products.filter(p => {
        if (activeTab === 'UNPAID') return !p.isPaid;
        return p.status === activeTab;
    });

    const tabCount = (key: string) => {
        if (key === 'UNPAID') return products.filter(p => !p.isPaid).length;
        return products.filter(p => p.status === key).length;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Mahsulotlarim</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{products.length} ta mahsulot</p>
                        </div>
                    </div>
                    <Link
                        href="/mahsulotlar/yuborish"
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Yangi
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab.label}
                            {tabCount(tab.key) > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                    activeTab === tab.key
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}>
                                    {tabCount(tab.key)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <ShoppingCart className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                            {activeTab === 'PUBLISHED' && 'Faol mahsulotlar yo\'q'}
                            {activeTab === 'DRAFT' && 'Kutilayotgan mahsulotlar yo\'q'}
                            {activeTab === 'ARCHIVED' && 'Bekor qilingan mahsulotlar yo\'q'}
                            {activeTab === 'UNPAID' && "To'lanmagan mahsulotlar yo'q"}
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                            Yangi mahsulot qo&apos;shishingiz mumkin
                        </p>
                        <Link
                            href="/mahsulotlar/yuborish"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Mahsulot qo&apos;shish
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredProducts.map(product => {
                            const badge = STATUS_BADGE[product.status];
                            return (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 p-4">
                                        {/* Image */}
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {product.media[0] ? (
                                                <img
                                                    src={product.media[0].thumbUrl || product.media[0].url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-7 h-7 text-slate-400" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight line-clamp-2">
                                                    {product.title}
                                                </p>
                                                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${badge?.cls || 'bg-slate-100 text-slate-500'}`}>
                                                    {badge?.label || product.status}
                                                </span>
                                            </div>
                                            <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mt-1">
                                                {formatPrice(product.priceAmount, product.priceCurrency)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                {product.category && (
                                                    <span className="text-xs text-slate-400">{product.category.name}</span>
                                                )}
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {product.viewCount}
                                                </span>
                                                {!product.isPaid && (
                                                    <span className="text-xs text-orange-500 font-medium">To'lanmagan</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700">
                                        {product.status === 'PUBLISHED' && (
                                            <Link
                                                href={`/mahsulotlar/${product.slug}`}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Ko&apos;rish
                                            </Link>
                                        )}
                                        <Link
                                            href={`/mahsulot/${product.id}/tahrir`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Tahrirlash
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            {deletingId === product.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                            O&apos;chirish
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MahsulotlarimPage() {
    return (
        <RequireAuth redirectTo="/profil">
            <MahsulotlarimContent />
        </RequireAuth>
    );
}
