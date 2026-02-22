'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { formatPrice, formatDate, getPurposeLabel, getGenderLabel } from '@/lib/utils';
import { getAdminListingById, approveListing, rejectListing } from '@/lib/admin-api';
import { MapPin, Calendar, Check, X, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminListingPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [listing, setListing] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    // Reject modal state
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadListing();
    }, [id]);

    const loadListing = async () => {
        try {
            setIsLoading(true);
            const response = await getAdminListingById(id);

            if (response.success && response.data) {
                setListing(response.data);
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
        setActionLoading('approve');
        setActionError(null);
        try {
            await approveListing(id);
            router.push('/admin/listings');
        } catch (err: any) {
            setActionError('Tasdiqlashda xatolik: ' + (err.message || 'Noma\'lum xato'));
            setActionLoading(null);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) return;
        setActionLoading('reject');
        setActionError(null);
        try {
            await rejectListing(id, rejectReason.trim());
            router.push('/admin/listings');
        } catch (err: any) {
            setActionError('Rad etishda xatolik: ' + (err.message || 'Noma\'lum xato'));
            setActionLoading(null);
            setShowRejectModal(false);
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
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <p className="text-red-800 dark:text-red-300 font-medium">Xatolik: {error || 'E\'lon topilmadi'}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">E'lonni rad etish</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Rad etish sababini kiriting. Bu sabab sotuvchining e&apos;lonlar sahifasida ko&apos;rsatiladi.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Masalan: Rasm sifati past, noto'g'ri kategoriya..."
                            rows={3}
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim() || actionLoading === 'reject'}
                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                            >
                                {actionLoading === 'reject' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                                Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/listings" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={handleApprove}
                        disabled={!!actionLoading}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        {actionLoading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                        Tasdiqlash
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={!!actionLoading}
                        className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Rad etish
                    </button>
                </div>
            </div>

            {actionError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    {actionError}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Gallery */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full mb-2">
                                {listing.status}
                            </span>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                {listing.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
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
                                        <div key={idx} className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                                            {media.type === 'VIDEO' ? (
                                                <video src={media.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={media.url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    Rasm yo&apos;q
                                </div>
                            )}
                        </div>

                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                            {formatPrice(listing.priceAmount, listing.priceCurrency)}
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Zoti</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.breed?.name || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Yoshi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.ageYears ? `${listing.ageYears} yosh` : '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Jinsi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{getGenderLabel(listing.gender || '')}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Maqsad</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{getPurposeLabel(listing.purpose || '')}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Hujjat</span>
                                <span className={`font-medium ${listing.hasPassport ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {listing.hasPassport ? 'Bor' : 'Yo\'q'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Rangi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.color || '-'}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">Tavsif</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {listing.description || 'Tavsif yo\'q'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Seller Info */}
                <div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">Sotuvchi</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-lg text-slate-600 dark:text-slate-300">
                                {listing.user?.displayName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{listing.user?.displayName || '-'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">@{listing.user?.telegramUsername || '-'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={handleApprove}
                                disabled={!!actionLoading}
                                className="w-full btn btn-primary mb-2 text-sm py-2"
                            >
                                {actionLoading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Tasdiqlash
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={!!actionLoading}
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
