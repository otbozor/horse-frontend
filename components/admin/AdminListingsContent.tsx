'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getAdminListings, approveListing, rejectListing } from '@/lib/admin-api';
import {
    Check, X, Eye, Loader2, Image as ImageIcon,
    ListFilter, Clock, CheckCircle, XCircle, CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { AdminPagination } from '@/components/listing/AdminPagination';

type TabKey = 'all' | 'pending' | 'approved' | 'rejected' | 'paid';

interface Tab {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    filter: { status?: string; isPaid?: string };
}

const TABS: Tab[] = [
    { key: 'all', label: "Barcha e'lonlar", icon: <ListFilter className="w-4 h-4" />, filter: {} },
    { key: 'pending', label: 'Kutilayotgan', icon: <Clock className="w-4 h-4" />, filter: { status: 'PENDING' } },
    { key: 'approved', label: 'Tasdiqlangan', icon: <CheckCircle className="w-4 h-4" />, filter: { status: 'APPROVED' } },
    { key: 'rejected', label: 'Bekor qilingan', icon: <XCircle className="w-4 h-4" />, filter: { status: 'REJECTED' } },
    { key: 'paid', label: "To'langan", icon: <CreditCard className="w-4 h-4" />, filter: { status: 'APPROVED', isPaid: 'true' } },
];

function getStatusBadge(status: string, isPaid: boolean) {
    switch (status) {
        case 'APPROVED':
            return isPaid
                ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Faol</span>
                : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">To&apos;lanmagan</span>;
        case 'PENDING':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Kutilmoqda</span>;
        case 'REJECTED':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Rad etilgan</span>;
        case 'DRAFT':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Qoralama</span>;
        case 'ARCHIVED':
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Arxivlangan</span>;
        default:
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">{status}</span>;
    }
}

function AdminListingsContentInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentTab = (searchParams.get('tab') as TabKey) || 'all';
    const currentPage = Number(searchParams.get('page')) || 1;

    const [listings, setListings] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabCounts, setTabCounts] = useState<Record<TabKey, number>>({
        all: 0, pending: 0, approved: 0, rejected: 0, paid: 0,
    });

    const activeTab = TABS.find(t => t.key === currentTab) || TABS[0];

    const loadListings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getAdminListings({
                ...activeTab.filter,
                page: currentPage,
                limit: 20,
            });

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
            setError(err.message || "Ma'lumotlarni yuklashda xatolik");
        } finally {
            setIsLoading(false);
        }
    };

    // Load tab counts
    const loadCounts = async () => {
        try {
            const results = await Promise.all(
                TABS.map(tab => getAdminListings({ ...tab.filter, page: 1, limit: 1 }))
            );
            const counts: Record<string, number> = {};
            results.forEach((res, i) => {
                counts[TABS[i].key] = res?.data?.pagination?.total || 0;
            });
            setTabCounts(counts as Record<TabKey, number>);
        } catch {
            // Ignore count errors
        }
    };

    useEffect(() => {
        loadListings();
    }, [currentTab, currentPage]);

    useEffect(() => {
        loadCounts();
    }, []);

    const switchTab = (tab: TabKey) => {
        const params = new URLSearchParams();
        params.set('tab', tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleApprove = async (id: string) => {
        if (!confirm("E'lonni tasdiqlaysizmi?")) return;
        try {
            await approveListing(id);
            await loadListings();
            await loadCounts();
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Rad etish sababini kiriting:');
        if (!reason) return;
        try {
            await rejectListing(id, reason);
            await loadListings();
            await loadCounts();
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        }
    };

    const getEmptyMessage = () => {
        switch (currentTab) {
            case 'pending': return "Kutilayotgan e'lonlar yo'q";
            case 'approved': return "Tasdiqlangan e'lonlar yo'q";
            case 'rejected': return "Rad etilgan e'lonlar yo'q";
            case 'paid': return "To'langan e'lonlar yo'q";
            default: return "Hech qanday e'lon topilmadi";
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">E&apos;lonlar boshqaruvi</h1>
                <p className="text-slate-500 text-sm">
                    Barcha e&apos;lonlarni status bo&apos;yicha ko&apos;ring va boshqaring
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => switchTab(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            currentTab === tab.key
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                            currentTab === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500'
                        }`}>
                            {tabCounts[tab.key] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="p-6 text-center">
                        <p className="text-red-600 font-medium">Xatolik: {error}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">E&apos;lon</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Foydalanuvchi</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Narx</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Hudud</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {listings.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.media && item.media[0] ? (
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                            <img
                                                                src={item.media[0].url?.startsWith('http') ? item.media[0].url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.media[0].url}`}
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
                                                        <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString('uz-UZ')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-primary-50 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-700">
                                                        {(item.user?.displayName || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-slate-600">
                                                        {item.user?.displayName || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {item.priceAmount?.toLocaleString() || 0} {item.priceCurrency || 'UZS'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {item.region?.nameUz || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(item.status, item.isPaid)}
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
                                                    {(item.status === 'PENDING') && (
                                                        <>
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
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {listings.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                                    <div className="p-3 bg-slate-50 rounded-full">
                                                        {activeTab.icon}
                                                    </div>
                                                    <p className="text-sm">{getEmptyMessage()}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

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
                    </>
                )}
            </div>
        </AdminLayout>
    );
}

export default function AdminListingsContent() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        }>
            <AdminListingsContentInner />
        </Suspense>
    );
}
