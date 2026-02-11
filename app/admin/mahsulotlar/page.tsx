'use client';

import { useState, useEffect } from 'react';
import { Check, X, Trash2, Eye, Package, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';

interface Product {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    status: string;
    stockStatus: string;
    viewCount: number;
    category?: { name: string };
    user?: { displayName: string; telegramUsername?: string };
    media: Array<{ url: string; thumbUrl?: string }>;
    createdAt: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('DRAFT');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);

            const res = await fetch(`${API_URL}/api/admin/products?${params}&limit=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : (data?.data ?? []));
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/admin/products/${id}/publish`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Mahsulotni rad etasizmi? Arxivlanadi.')) return;
        setProcessingId(id);
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/admin/products/${id}/archive`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Mahsulotni o\'chirishni xohlaysizmi?')) return;
        setProcessingId(id);
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } finally {
            setProcessingId(null);
        }
    };

    const formatPrice = (amount: number, currency: string = 'UZS') =>
        currency === 'USD' ? `$${Number(amount).toLocaleString()}` : `${Number(amount).toLocaleString()} so'm`;

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            DRAFT: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
            PUBLISHED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            ARCHIVED: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
        };
        const labels: Record<string, string> = {
            DRAFT: 'Kutilmoqda',
            PUBLISHED: 'Nashr qilingan',
            ARCHIVED: 'Arxivlangan',
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || map.DRAFT}`}>
                {labels[status] || status}
            </span>
        );
    };

    const tabs = [
        { key: 'DRAFT', label: 'Kutilayotgan' },
        { key: 'PUBLISHED', label: 'Nashr qilingan' },
        { key: 'ARCHIVED', label: 'Arxiv' },
        { key: 'all', label: 'Barchasi' },
    ];

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mahsulotlar</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Foydalanuvchilar tomonidan yuborilgan mahsulotlarni tasdiqlang yoki rad eting
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === tab.key
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Package className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            {filter === 'DRAFT' ? 'Kutilayotgan mahsulotlar yo\'q' : 'Mahsulotlar topilmadi'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Mahsulot</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Sotuvchi</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Narx</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Holat</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {product.media[0] ? (
                                                        <img
                                                            src={product.media[0].thumbUrl || product.media[0].url}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{product.title}</p>
                                                    <p className="text-xs text-slate-400">{product.category?.name || 'Kategoriyasiz'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {product.user?.displayName || '—'}
                                            </p>
                                            {product.user?.telegramUsername && (
                                                <p className="text-xs text-slate-400">@{product.user.telegramUsername}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                                {formatPrice(product.priceAmount, product.priceCurrency)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{statusBadge(product.status)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {product.status === 'DRAFT' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(product.id)}
                                                            disabled={processingId === product.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Tasdiqlash"
                                                        >
                                                            {processingId === product.id ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <Check className="w-3.5 h-3.5" />
                                                            )}
                                                            Tasdiqlash
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(product.id)}
                                                            disabled={processingId === product.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Rad etish"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            Rad etish
                                                        </button>
                                                    </>
                                                )}
                                                {product.status === 'PUBLISHED' && (
                                                    <button
                                                        onClick={() => handleReject(product.id)}
                                                        disabled={processingId === product.id}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="Arxivlash"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        Arxivlash
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={processingId === product.id}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
