'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getPendingListings, approveListing, rejectListing } from '@/lib/admin-api';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminListingsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadListings = async () => {
        try {
            setIsLoading(true);
            const data = await getPendingListings();
            setListings(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || 'Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

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
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Moderatsiya</h1>
                    <p className="text-slate-500">Tasdiqlash kutilayotgan e'lonlar</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                            <th className="px-6 py-4 font-semibold">E'lon</th>
                            <th className="px-6 py-4 font-semibold">Foydalanuvchi</th>
                            <th className="px-6 py-4 font-semibold">Narx</th>
                            <th className="px-6 py-4 font-semibold">Hudud</th>
                            <th className="px-6 py-4 font-semibold text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {listings.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{item.title}</p>
                                    <p className="text-xs text-slate-500">{item.date || new Date(item.createdAt).toLocaleDateString('uz-UZ')}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.user?.displayName || item.user || '-'}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {item.price || `${item.priceAmount} ${item.priceCurrency}`}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.region || item.district?.region?.nameUz || '-'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/ot/${item.id}`}
                                        className="inline-flex p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Ko'rish"
                                        target="_blank"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleApprove(item.id)}
                                        className="inline-flex p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Tasdiqlash"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleReject(item.id)}
                                        className="inline-flex p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Rad etish"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {listings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Hozircha kutilayotgan e'lonlar yo'q
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
