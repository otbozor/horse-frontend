'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { GiHorseHead } from 'react-icons/gi';
import { Plus, Edit, Eye, ChevronLeft, ChevronRight, Package, Trash2, CheckCircle, Clock, CreditCard, XCircle, Archive } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface Listing {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
    isPaid: boolean;
    viewCount: number;
    createdAt: string;
    region: { nameUz: string };
    media: Array<{ url: string; thumbUrl?: string }>;
}

interface Product {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    viewCount: number;
    createdAt: string;
    category?: { name: string; slug: string } | null;
    media: Array<{ url: string; thumbUrl?: string }>;
}

type MainTab = 'horses' | 'products';
type StatusFilter = 'active' | 'pending' | 'unpaid' | 'inactive' | 'rejected';

const STATUS_TABS: { key: StatusFilter; label: string; icon: any }[] = [
    { key: 'active', label: 'Faol', icon: CheckCircle },
    { key: 'pending', label: 'Kutish', icon: Clock },
    { key: 'unpaid', label: "To'lanmagan", icon: CreditCard },
    { key: 'inactive', label: 'Faol emas', icon: Archive },
    { key: 'rejected', label: 'Rad etilgan', icon: XCircle },
];

const ITEMS_PER_PAGE = 12;

function filterListings(listings: Listing[], filter: StatusFilter): Listing[] {
    switch (filter) {
        case 'active':
            return listings.filter(l => l.status === 'APPROVED');
        case 'pending':
            return listings.filter(l => l.status === 'PENDING');
        case 'unpaid':
            return listings.filter(l => !l.isPaid && (l.status === 'APPROVED' || l.status === 'DRAFT' || l.status === 'ARCHIVED'));
        case 'inactive':
            return listings.filter(l => l.status === 'DRAFT' || l.status === 'ARCHIVED');
        case 'rejected':
            return listings.filter(l => l.status === 'REJECTED');
        default:
            return listings;
    }
}

function getStatusCounts(listings: Listing[]) {
    return {
        active: listings.filter(l => l.status === 'APPROVED').length,
        pending: listings.filter(l => l.status === 'PENDING').length,
        unpaid: listings.filter(l => !l.isPaid && (l.status === 'APPROVED' || l.status === 'DRAFT' || l.status === 'ARCHIVED')).length,
        inactive: listings.filter(l => l.status === 'DRAFT' || l.status === 'ARCHIVED').length,
        rejected: listings.filter(l => l.status === 'REJECTED').length,
    };
}

function MyListingsPageContent() {
    const { user } = useAuth();
    const [mainTab, setMainTab] = useState<MainTab>('horses');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
    const [listings, setListings] = useState<Listing[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredListings = useMemo(() => filterListings(listings, statusFilter), [listings, statusFilter]);
    const statusCounts = useMemo(() => getStatusCounts(listings), [listings]);

    const currentItems = mainTab === 'horses' ? filteredListings : products;
    const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return currentItems.slice(start, start + ITEMS_PER_PAGE);
    }, [currentItems, currentPage]);

    const loading = mainTab === 'horses' ? loadingListings : loadingProducts;

    useEffect(() => {
        if (user) {
            fetchListings();
            fetchProducts();
        }
    }, [user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [mainTab, statusFilter]);

    const fetchListings = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/listings`,
                {
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data?.data ?? []);
            setListings(items);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoadingListings(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/products`,
                {
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data?.data ?? []);
            setProducts(items);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Mahsulotni o\'chirishni xohlaysizmi?')) return;
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/products/${productId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const getListingStatusBadge = (listing: Listing) => {
        if (listing.status === 'APPROVED' && listing.isPaid) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Faol</span>;
        }
        if (listing.status === 'APPROVED' && !listing.isPaid) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">To'lanmagan</span>;
        }
        const config: Record<string, { style: string; label: string }> = {
            DRAFT: { style: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', label: 'Qoralama' },
            PENDING: { style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Kutilmoqda' },
            REJECTED: { style: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Rad etilgan' },
            ARCHIVED: { style: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', label: 'Arxivlangan' },
        };
        const c = config[listing.status] || config.DRAFT;
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.style}`}>{c.label}</span>;
    };

    const getProductStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
            PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            ARCHIVED: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        };
        const labels: Record<string, string> = {
            DRAFT: 'Qoralama',
            PUBLISHED: 'Chop etilgan',
            ARCHIVED: 'Arxivlangan',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getEmptyState = () => {
        const states: Record<StatusFilter, { Icon: any; color: string; title: string; desc: string }> = {
            active: { Icon: CheckCircle, color: 'text-green-400 dark:text-green-500', title: 'Faol e\'lonlar yo\'q', desc: 'Tasdiqlangan e\'lonlaringiz bu yerda ko\'rinadi' },
            pending: { Icon: Clock, color: 'text-yellow-400 dark:text-yellow-500', title: 'Kutilayotgan e\'lonlar yo\'q', desc: 'Tekshiruvga yuborilgan e\'lonlaringiz bu yerda ko\'rinadi' },
            unpaid: { Icon: CreditCard, color: 'text-orange-400 dark:text-orange-500', title: 'To\'lanmagan e\'lonlar yo\'q', desc: 'To\'lov qilinmagan e\'lonlar bu yerda ko\'rinadi' },
            inactive: { Icon: Archive, color: 'text-slate-400 dark:text-slate-500', title: 'Faol bo\'lmagan e\'lonlar yo\'q', desc: 'Qoralama va arxivlangan e\'lonlaringiz bu yerda ko\'rinadi' },
            rejected: { Icon: XCircle, color: 'text-red-400 dark:text-red-500', title: 'Rad etilgan e\'lonlar yo\'q', desc: 'Rad etilgan e\'lonlaringiz bu yerda ko\'rinadi' },
        };
        return states[statusFilter];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 sm:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Mening e'lonlarim</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">Barcha e'lonlaringizni boshqaring</p>
                    </div>
                    {mainTab === 'horses' ? (
                        <Link href="/elon/yaratish" className="btn btn-primary w-full sm:w-auto justify-center">
                            <Plus className="w-5 h-5" />
                            Ot e'loni yaratish
                        </Link>
                    ) : (
                        <Link href="/mahsulot/yaratish" className="btn btn-primary w-full sm:w-auto justify-center">
                            <Plus className="w-5 h-5" />
                            Mahsulot yaratish
                        </Link>
                    )}
                </div>

                {/* Main Tabs: Otlar / Mahsulotlar */}
                <div className="flex gap-1 mb-4 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto sm:inline-flex">
                    <button
                        onClick={() => setMainTab('horses')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            mainTab === 'horses'
                                ? 'bg-primary-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <GiHorseHead className="w-4 h-4" />
                        Ot e'lonlari
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            mainTab === 'horses' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}>{listings.length}</span>
                    </button>
                    <button
                        onClick={() => setMainTab('products')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            mainTab === 'products'
                                ? 'bg-primary-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        Mahsulotlar
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            mainTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}>{products.length}</span>
                    </button>
                </div>

                {/* Status Sub-tabs (only for horses) */}
                {mainTab === 'horses' && (
                    <div className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
                        {STATUS_TABS.map(tab => {
                            const Icon = tab.icon;
                            const count = statusCounts[tab.key];
                            const isActive = statusFilter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setStatusFilter(tab.key)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                        isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                    {count > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                            isActive
                                                ? 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                        }`}>{count}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content */}
                {mainTab === 'horses' ? (
                    filteredListings.length > 0 ? (
                        <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {(paginatedItems as Listing[]).map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                                >
                                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
                                        {listing.media[0] ? (
                                            <img
                                                src={listing.media[0].thumbUrl || listing.media[0].url}
                                                alt={listing.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-500">
                                                <GiHorseHead className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {getListingStatusBadge(listing)}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                                            {listing.title}
                                        </h3>
                                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                            {listing.priceAmount.toLocaleString()} {listing.priceCurrency}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            <Eye className="w-4 h-4" />
                                            <span>{listing.viewCount} ko'rishlar</span>
                                        </div>

                                        <div className="flex gap-2">
                                            {(listing.status === 'DRAFT' || listing.status === 'REJECTED') && (
                                                <Link
                                                    href={`/elon/${listing.id}/edit`}
                                                    className="flex-1 btn btn-outline btn-sm"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Tahrirlash
                                                </Link>
                                            )}
                                            {listing.status === 'APPROVED' && listing.isPaid && (
                                                <Link
                                                    href={`/ot/${listing.slug}`}
                                                    className="flex-1 btn btn-outline btn-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ko'rish
                                                </Link>
                                            )}
                                            {listing.status === 'APPROVED' && !listing.isPaid && (
                                                <Link
                                                    href={`/elon/${listing.id}/tolov`}
                                                    className="flex-1 btn btn-primary btn-sm"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                    To'lov qilish
                                                </Link>
                                            )}
                                            {listing.status === 'PENDING' && (
                                                <span className="flex-1 flex items-center justify-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                                                    <Clock className="w-4 h-4" />
                                                    Tekshiruvda...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Sahifa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                                p === currentPage
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                        </>
                    ) : (
                        <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                            {(() => { const { Icon, color } = getEmptyState(); return <Icon className={`w-16 h-16 mx-auto mb-4 ${color}`} />; })()}
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                                {getEmptyState().title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {getEmptyState().desc}
                            </p>
                            {(statusFilter === 'inactive' || listings.length === 0) && (
                                <Link href="/elon/yaratish" className="btn btn-primary">
                                    <Plus className="w-5 h-5" />
                                    Ot e'loni yaratish
                                </Link>
                            )}
                        </div>
                    )
                ) : (
                    /* Products */
                    products.length > 0 ? (
                        <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {(paginatedItems as Product[]).map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                                >
                                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
                                        {product.media[0] ? (
                                            <img
                                                src={product.media[0].thumbUrl || product.media[0].url}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-500">
                                                <Package className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {getProductStatusBadge(product.status)}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                            {product.priceAmount.toLocaleString()} {product.priceCurrency}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{product.viewCount} ko'rishlar</span>
                                        </div>
                                        {product.category && (
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-3">
                                                {product.category.name}
                                            </span>
                                        )}

                                        <div className="flex gap-2">
                                            {product.status === 'PUBLISHED' && (
                                                <Link
                                                    href={`/mahsulotlar/${product.slug}`}
                                                    className="flex-1 btn btn-outline btn-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ko'rish
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="btn btn-outline btn-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Sahifa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                                p === currentPage
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                        </>
                    ) : (
                        <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                            <Package className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                                Hozircha mahsulotlaringiz yo'q
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Birinchi mahsulotingizni yarating va sotishni boshlang
                            </p>
                            <Link href="/mahsulot/yaratish" className="btn btn-primary">
                                <Plus className="w-5 h-5" />
                                Mahsulot yaratish
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default function MyListingsPage() {
    return (
        <RequireAuth redirectTo="/profil/elonlarim">
            <MyListingsPageContent />
        </RequireAuth>
    );
}
