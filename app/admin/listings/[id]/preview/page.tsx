'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { formatPrice, formatDate, getPurposeLabel, getGenderLabel } from '@/lib/utils';
import { approveListing, rejectListing } from '@/lib/admin-api';
import { MapPin, Calendar, Check, X, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminListingPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadListing();
    }, [id]);

    const loadListing = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/listings/${id}`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success && data.data) {
                setListing(data.data);
            } else {
                setError('E\'lon topilmadi');
            }
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('E\'lonni tasdiqlaysizmi?')) return;
        try {
            await approveListing(id);
            router.push('/admin/listings');
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        }
    };

    const handleReject = async () => {
        const reason = prompt('Rad etish sababini kiriting:');
        if (!reason) return;
        try {
            await rejectListing(id, reason);
            router.push('/admin/listings');
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    if (error || !listing) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">Xatolik: {error || 'E\'lon topilmadi'}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/listings" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={handleApprove}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Tasdiqlash
                    </button>
                    <button
                        onClick={handleReject}
                        className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Rad etish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Gallery */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-2">
                                {listing.status}
                            </span>
                            <h1 className="text-xl font-bold text-slate-900 mb-2">
                                {listing.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {listing.region?.nameUz}, {listing.district?.nameUz}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(listing.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* Compact Gallery */}
                        <div className="mb-4">
                            {listing.media && listing.media.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {listing.media.slice(0, 6).map((media: any, idx: number) => (
                                        <div key={idx} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                                            {media.type === 'VIDEO' ? (
                                                <video src={media.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={media.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    Rasm yo'q
                                </div>
                            )}
                        </div>

                        <div className="text-2xl font-bold text-primary-600 mb-4">
                            {formatPrice(listing.priceAmount, listing.priceCurrency)}
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Zoti</span>
                                <span className="font-semibold text-slate-900">{listing.breed?.name || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Yoshi</span>
                                <span className="font-semibold text-slate-900">{listing.ageYears ? `${listing.ageYears} yosh` : '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Jinsi</span>
                                <span className="font-semibold text-slate-900">{getGenderLabel(listing.gender || '')}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Maqsad</span>
                                <span className="font-semibold text-slate-900">{getPurposeLabel(listing.purpose || '')}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Hujjat</span>
                                <span className={`font-medium ${listing.hasPassport ? 'text-green-600' : 'text-slate-400'}`}>
                                    {listing.hasPassport ? 'Bor' : 'Yo\'q'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 mb-1">Rangi</span>
                                <span className="font-semibold text-slate-900">{listing.color || '-'}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm mb-2">Tavsif</h3>
                            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                {listing.description || 'Tavsif yo\'q'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Seller Info */}
                <div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-sm mb-3">Sotuvchi</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-lg">
                                {listing.user?.displayName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">{listing.user?.displayName || '-'}</p>
                                <p className="text-xs text-slate-500">@{listing.user?.telegramUsername || '-'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={handleApprove}
                                className="w-full btn btn-primary mb-2 text-sm py-2"
                            >
                                <Check className="w-4 h-4" />
                                Tasdiqlash
                            </button>
                            <button
                                onClick={handleReject}
                                className="w-full btn bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                            >
                                <X className="w-4 h-4" />
                                Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
