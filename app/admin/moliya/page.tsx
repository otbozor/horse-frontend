'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Save, Loader2, TrendingUp, Package, List, CheckCircle, Clock, XCircle, Zap, Rocket, Crown, RefreshCw } from 'lucide-react';
import { getFinanceSettings, updateFinanceSettings, getAdminPayments } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    COMPLETED: { label: 'To\'langan', color: 'bg-green-100 text-green-700' },
    PENDING: { label: 'Kutilmoqda', color: 'bg-amber-100 text-amber-700' },
    CANCELLED: { label: 'Bekor', color: 'bg-red-100 text-red-700' },
    FAILED: { label: 'Xato', color: 'bg-red-100 text-red-700' },
};

const PACKAGE_META = [
    { key: 'OSON_START', label: 'Oson start', days: '3 kun', Icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'TEZKOR_SAVDO', label: 'Tezkor savdo', days: '7 kun', Icon: Rocket, color: 'text-primary-600', bg: 'bg-primary-50' },
    { key: 'TURBO_SAVDO', label: 'Premium', days: '30 kun', Icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50' },
] as const;

export default function AdminMoliyaPage() {
    const [productPrice, setProductPrice] = useState('');
    const [reactivationPrice, setReactivationPrice] = useState('');
    const [pkgPrices, setPkgPrices] = useState<Record<string, { price: string; discount: string }>>({
        OSON_START: { price: '', discount: '' },
        TEZKOR_SAVDO: { price: '', discount: '' },
        TURBO_SAVDO: { price: '', discount: '' },
    });
    const [bundlePrices, setBundlePrices] = useState({ bundle5: '', bundle10: '', bundle20: '' });
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settingsError, setSettingsError] = useState('');
    const [settingsSuccess, setSettingsSuccess] = useState('');

    const [payments, setPayments] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoadingPayments, setIsLoadingPayments] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        getFinanceSettings()
            .then(res => {
                if (res.success && res.data) {
                    setProductPrice(String(res.data.productListingPrice));
                    setReactivationPrice(String(res.data.reactivationPrice));
                    const lp = res.data.listingPackages;
                    setPkgPrices({
                        OSON_START: { price: String(lp.OSON_START.price), discount: lp.OSON_START.discountPrice ? String(lp.OSON_START.discountPrice) : '' },
                        TEZKOR_SAVDO: { price: String(lp.TEZKOR_SAVDO.price), discount: lp.TEZKOR_SAVDO.discountPrice ? String(lp.TEZKOR_SAVDO.discountPrice) : '' },
                        TURBO_SAVDO: { price: String(lp.TURBO_SAVDO.price), discount: lp.TURBO_SAVDO.discountPrice ? String(lp.TURBO_SAVDO.discountPrice) : '' },
                    });
                    if (res.data.listingBundles) {
                        const b = res.data.listingBundles;
                        setBundlePrices({ bundle5: String(b.bundle5), bundle10: String(b.bundle10), bundle20: String(b.bundle20) });
                    }
                }
            })
            .catch(() => {})
            .finally(() => setIsLoadingSettings(false));
    }, []);

    useEffect(() => {
        setIsLoadingPayments(true);
        getAdminPayments({ page, limit: 20, status: statusFilter || undefined, type: typeFilter || undefined })
            .then(res => {
                if (res.success && res.data) {
                    setPayments(res.data.payments);
                    setTotal(res.data.total);
                    setTotalPages(res.data.totalPages);
                    setTotalRevenue(res.data.totalRevenue);
                }
            })
            .finally(() => setIsLoadingPayments(false));
    }, [page, statusFilter, typeFilter]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsError('');
        setSettingsSuccess('');
        setIsSaving(true);
        try {
            const listingPackages: any = {};
            for (const pkg of PACKAGE_META) {
                const p = pkgPrices[pkg.key];
                const price = Number(p.price);
                const discount = p.discount ? Number(p.discount) : null;
                if (discount !== null && discount >= price) {
                    setSettingsError(`${pkg.label}: chegirma narxi asl narxdan kichik bo'lishi kerak`);
                    setIsSaving(false);
                    return;
                }
                listingPackages[pkg.key] = { price, discountPrice: discount };
            }
            const res = await updateFinanceSettings({
                productListingPrice: Number(productPrice),
                reactivationPrice: Number(reactivationPrice),
                listingPackages,
                listingBundles: {
                    bundle5: Number(bundlePrices.bundle5),
                    bundle10: Number(bundlePrices.bundle10),
                    bundle20: Number(bundlePrices.bundle20),
                },
            });
            if (res.success) setSettingsSuccess('Narxlar muvaffaqiyatli yangilandi!');
            else setSettingsError(res.message || 'Xatolik');
        } catch (err: any) {
            setSettingsError(err.message || 'Xatolik');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Moliya</h1>
                <p className="text-slate-500">To'lovlar va narx sozlamalari</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Jami tushum</p>
                        <p className="text-xl font-bold text-slate-900">{totalRevenue.toLocaleString('uz-UZ')} so'm</p>
                    </div>
                </div>
                {/* Total payments */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Jami to'lovlar</p>
                        <p className="text-xl font-bold text-slate-900">{total}</p>
                    </div>
                </div>
            </div>

            {/* Pricing Settings */}
            <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">Narx sozlamalari</h2>
                        <p className="text-sm text-slate-500">Chegirma narxi kiritilsa, asl narx ustiga chiziladi</p>
                    </div>
                    {settingsSuccess && <p className="text-sm text-green-600 font-medium">{settingsSuccess}</p>}
                    {settingsError && <p className="text-sm text-red-600">{settingsError}</p>}
                </div>

                {isLoadingSettings ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : (
                    <div className="space-y-6">
                        {/* Fixed prices row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Product price */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                                    <Package className="w-5 h-5 text-slate-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 mb-1">Mahsulot joylash narxi</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={productPrice}
                                            onChange={e => setProductPrice(e.target.value)}
                                            min="1000" step="1000"
                                            className="w-36 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="35000"
                                        />
                                        <span className="text-sm text-slate-400">so'm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reactivation price */}
                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                                    <RefreshCw className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900 mb-0.5">Muddati tugagan e'lonni faollashtirish narxi</p>
                                    <p className="text-xs text-slate-400 mb-1">E'lon EXPIRED → to'lov → KUTILAYOTGAN</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={reactivationPrice}
                                            onChange={e => setReactivationPrice(e.target.value)}
                                            min="1000" step="1000"
                                            className="w-36 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="50000"
                                        />
                                        <span className="text-sm text-slate-400">so'm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Listing credit bundles */}
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">E&apos;lon joylash paketlari (kredit)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {([
                                    { key: 'bundle5' as const, label: '5 ta e\'lon', desc: 'Kichik paket' },
                                    { key: 'bundle10' as const, label: '10 ta e\'lon', desc: 'O\'rta paket' },
                                    { key: 'bundle20' as const, label: '20 ta e\'lon', desc: 'Katta paket' },
                                ]).map(({ key, label, desc }) => (
                                    <div key={key} className="p-4 bg-green-50 rounded-xl border border-slate-200">
                                        <p className="text-sm font-semibold text-slate-900 mb-0.5">{label}</p>
                                        <p className="text-xs text-slate-400 mb-2">{desc}</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={bundlePrices[key]}
                                                onChange={e => setBundlePrices(prev => ({ ...prev, [key]: e.target.value }))}
                                                min="1000" step="1000"
                                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                            <span className="text-xs text-slate-400 whitespace-nowrap">so&apos;m</span>
                                        </div>
                                        {bundlePrices[key] && Number(bundlePrices[key]) > 0 && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                1 ta = {Math.round(Number(bundlePrices[key]) / Number(key.replace('bundle', ''))).toLocaleString('uz-UZ')} so&apos;m
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Listing packages */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {PACKAGE_META.map(({ key, label, days, Icon, color, bg }) => {
                                const p = pkgPrices[key];
                                return (
                                    <div key={key} className={`p-4 ${bg} rounded-xl border border-slate-200`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon className={`w-4 h-4 ${color}`} />
                                            <p className="text-sm font-semibold text-slate-900">{label}</p>
                                            <span className="text-xs text-slate-400">{days}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">Asl narx (so'm)</label>
                                                <input
                                                    type="number"
                                                    value={p.price}
                                                    onChange={e => setPkgPrices(prev => ({ ...prev, [key]: { ...prev[key], price: e.target.value } }))}
                                                    min="1000" step="100"
                                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">Chegirma narxi (ixtiyoriy)</label>
                                                <input
                                                    type="number"
                                                    value={p.discount}
                                                    onChange={e => setPkgPrices(prev => ({ ...prev, [key]: { ...prev[key], discount: e.target.value } }))}
                                                    min="0" step="100"
                                                    placeholder="bo'sh = chegirma yo'q"
                                                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-slate-300"
                                                />
                                            </div>
                                            {p.discount && Number(p.discount) > 0 && Number(p.discount) < Number(p.price) && (
                                                <p className="text-xs text-green-600">
                                                    <span className="line-through text-slate-400">{Number(p.price).toLocaleString('uz-UZ')}</span>
                                                    {' → '}
                                                    <strong>{Number(p.discount).toLocaleString('uz-UZ')} so'm</strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSaving || isLoadingSettings} className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Saqlash
                    </button>
                </div>
            </form>

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
                <CustomSelect
                    name="statusFilter"
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="w-44"
                    options={[
                        { value: '', label: 'Barcha holat' },
                        { value: 'COMPLETED', label: "To'langan" },
                        { value: 'PENDING', label: 'Kutilmoqda' },
                        { value: 'CANCELLED', label: 'Bekor' },
                    ]}
                />
                <CustomSelect
                    name="typeFilter"
                    value={typeFilter}
                    onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                    className="w-40"
                    options={[
                        { value: '', label: 'Barcha tur' },
                        { value: 'listing', label: "E'lon" },
                        { value: 'product', label: 'Mahsulot' },
                    ]}
                />
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Foydalanuvchi</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Tur</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Sarlavha</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Summa</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Holat</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-600">Sana</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingPayments ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        To'lovlar topilmadi
                                    </td>
                                </tr>
                            ) : (
                                payments.map(p => (
                                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900">{p.user?.displayName || '—'}</p>
                                            <p className="text-xs text-slate-400">{p.user?.phone || ''}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                                                {p.type === 'listing'
                                                    ? <><List className="w-3 h-3" /> E'lon</>
                                                    : <><Package className="w-3 h-3" /> Mahsulot</>
                                                }
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 max-w-[200px] truncate text-slate-700">
                                            {p.subject?.title || '—'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {p.amount.toLocaleString('uz-UZ')} so'm
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[p.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                                                {p.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                                                {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                                {(p.status === 'CANCELLED' || p.status === 'FAILED') && <XCircle className="w-3 h-3" />}
                                                {STATUS_LABELS[p.status]?.label || p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString('uz-UZ')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                        <p className="text-sm text-slate-500">Jami: {total}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50">
                                Oldingi
                            </button>
                            <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50">
                                Keyingi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
