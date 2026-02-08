'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getPendingListings, approveListing, rejectListing } from '@/lib/admin-api';
import { Check, X, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminPagination } from '@/components/listing/AdminPagination';

function AdminListingsContent() {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [listings, setListings] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadListings = async () => {
        try {
            setIsLoading(true);
            const response = await getPendingListings(currentPage, 20);
            console.log('API response:', response);

            // Response structure: { success: true, data: { data: [...], pagination: {...} } }
            if (response.success && response.data) {
                const listingsData = response.data.data || response.data;
                const paginationData = response.data.pagination || { page: currentPage, limit: 20, total: 0, totalPages: 0 };

                setListings(Array.isArray(listingsData) ? listingsData : []);
                setPagination(paginationData);
            } else {
                setListings([]);
                setPagination({ page: currentPage, limit: 20, total: 0, totalPages: 0 });
            }
        } catch (err: any) {
            console.error('Error loading listings:', err);
            setError(err.message || 'Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, [currentPage]);

    const handleApprove = async (id: string) => {
        if (!confirm('E\'lonni tasdiqlaysizmi?')) return;
        try {
            await approveListing(id);
            await loadListings(); // Reload listings
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Rad etish sababini kiriting:');
        if (!reason) return;
        try {
            await rejectListing(id, reason);
            await loadListings(); // Reload listings
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

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">Xatolik: {error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Moderatsiya</h1>
                    <p className="text-slate-500 text-sm">
                        Tasdiqlash kutilayotgan e'lonlar ({pagination.total})
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">E'lon</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Foydalanuvchi</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Narx</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Hudud</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {listings.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.images && item.images[0] ? (
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                    <img
                                                        src={item.images[0].url?.startsWith('http') ? item.images[0].url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.images[0].url}`}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Rasm';
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 flex-shrink-0">
                                                    <ImageIcon className="w-5 h-5 text-slate-300" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                                                <span className="text-xs text-slate-500">{item.date || new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-primary-50 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-700">
                                                {(typeof item.user === 'string' ? item.user : item.user?.displayName || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-slate-600">
                                                {typeof item.user === 'string' ? item.user : item.user?.displayName || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-900">
                                            {typeof item.price === 'string'
                                                ? item.price
                                                : `${item.priceAmount?.toLocaleString() || 0} ${item.priceCurrency || 'UZS'}`
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">
                                            {item.region?.nameUz || item.district?.region?.nameUz || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={`/admin/listings/${item.id}/preview`}
                                                className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                title="Ko'rish"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="Tasdiqlash"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Rad etish"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {listings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                            <div className="p-3 bg-slate-50 rounded-full">
                                                <Eye className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm">Hozircha moderatsiya uchun e'lonlar yo'q</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200">
                        <AdminPagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            searchParams={Object.fromEntries(searchParams.entries())}
                            basePath="/admin/listings"
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default function AdminListingsPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        }>
            <AdminListingsContent />
        </Suspense>
    );
}
