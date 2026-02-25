'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Check, X, Loader2, ArrowLeft, MapPin, Eye, Package, Calendar, Truck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatPrice(amount: number, currency = 'UZS') {
    if (currency === 'USD') return `$${Number(amount).toLocaleString()}`;
    return `${Number(amount).toLocaleString()} so'm`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        DRAFT: { label: 'Kutilmoqda', cls: 'bg-amber-100 text-amber-700' },
        PUBLISHED: { label: 'Nashr qilingan', cls: 'bg-green-100 text-green-700' },
        ARCHIVED: { label: 'Arxivlangan', cls: 'bg-slate-100 text-slate-600' },
    };
    const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-600' };
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${s.cls}`}>
            {s.label}
        </span>
    );
}

export default function AdminProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<'approve' | 'archive' | null>(null);
    const [selectedImg, setSelectedImg] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Mahsulot topilmadi');
            const data = await res.json();
            setProduct(data);
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading('approve');
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/admin/products/${id}/publish`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push('/admin/mahsulotlar');
        } catch {
            setActionLoading(null);
        }
    };

    const handleArchive = async () => {
        if (!confirm('Mahsulotni arxivlaysizmi?')) return;
        setActionLoading('archive');
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_URL}/api/admin/products/${id}/archive`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push('/admin/mahsulotlar');
        } catch {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !product) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700 font-medium">{error || 'Mahsulot topilmadi'}</p>
                    <Link href="/admin/mahsulotlar" className="text-sm text-slate-500 mt-2 inline-block hover:underline">
                        Orqaga qaytish
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                <Link
                    href="/admin/mahsulotlar"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga
                </Link>
                <div className="flex gap-2 flex-wrap">
                    {product.status === 'DRAFT' && (
                        <>
                            <button
                                onClick={handleApprove}
                                disabled={!!actionLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                {actionLoading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Tasdiqlash
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={!!actionLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Rad etish
                            </button>
                        </>
                    )}
                    {product.status === 'PUBLISHED' && (
                        <button
                            onClick={handleArchive}
                            disabled={!!actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                            {actionLoading === 'archive' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            Arxivlash
                        </button>
                    )}
                    {product.slug && (
                        <Link
                            href={`/mahsulotlar/${product.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Saytda ko'rish
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: images + details */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Images */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        {product.media && product.media.length > 0 ? (
                            <>
                                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-3">
                                    <img
                                        src={product.media[selectedImg]?.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {product.media.length > 1 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {product.media.map((m: any, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImg(i)}
                                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                    i === selectedImg ? 'border-primary-500' : 'border-transparent'
                                                }`}
                                            >
                                                <img src={m.thumbUrl || m.url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                <Package className="w-12 h-12" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <StatusBadge status={product.status} />
                                {product.category && (
                                    <span className="ml-2 text-xs text-slate-400">{product.category.name}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Eye className="w-3.5 h-3.5" />
                                {product.viewCount ?? 0} ko'rildi
                            </div>
                        </div>

                        <h1 className="text-xl font-bold text-slate-900 mb-2">{product.title}</h1>

                        <p className="text-2xl font-bold text-primary-600 mb-4">
                            {formatPrice(Number(product.priceAmount), product.priceCurrency)}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-5">
                            {(product.region || product.district) && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {product.district ? `${product.district.nameUz}, ` : ''}
                                    {product.region?.nameUz}
                                </span>
                            )}
                            {product.hasDelivery && (
                                <span className="flex items-center gap-1 text-green-600">
                                    <Truck className="w-4 h-4" />
                                    Yetkazib berish bor
                                </span>
                            )}
                            {product.createdAt && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(product.createdAt)}
                                </span>
                            )}
                        </div>

                        <hr className="border-slate-100 mb-4" />
                        <h3 className="font-semibold text-slate-900 mb-2">Tavsif</h3>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm">
                            {product.description || "Tavsif yo'q"}
                        </p>
                    </div>
                </div>

                {/* Right: seller + quick actions */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
                        <h3 className="font-semibold text-slate-900 mb-4">Sotuvchi</h3>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold flex-shrink-0">
                                {product.user?.displayName?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">{product.user?.displayName || '—'}</p>
                                {product.user?.telegramUsername && (
                                    <p className="text-xs text-slate-400">@{product.user.telegramUsername}</p>
                                )}
                            </div>
                        </div>

                        <hr className="border-slate-100 mb-4" />

                        <div className="space-y-2">
                            {product.status === 'DRAFT' && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        disabled={!!actionLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {actionLoading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Tasdiqlash
                                    </button>
                                    <button
                                        onClick={handleArchive}
                                        disabled={!!actionLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Rad etish
                                    </button>
                                </>
                            )}
                            {product.status === 'PUBLISHED' && (
                                <button
                                    onClick={handleArchive}
                                    disabled={!!actionLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                                >
                                    {actionLoading === 'archive' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                    Arxivlash
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
