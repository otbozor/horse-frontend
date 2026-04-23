'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, CreditCard, Loader2, CheckCircle, Megaphone } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { createCreditBundleInvoice } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

type BundleSize = 5 | 10 | 20;

interface BundlePrices {
    bundle5: number;
    bundle10: number;
    bundle20: number;
}

interface BoostPackages {
    OSON_START: { amount: number; originalAmount: number; hasDiscount: boolean };
    TEZKOR_SAVDO: { amount: number; originalAmount: number; hasDiscount: boolean };
    TURBO_SAVDO: { amount: number; originalAmount: number; hasDiscount: boolean };
}

function PaketlarContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'credits' | 'reklama'>('credits');
    const [prices, setPrices] = useState<BundlePrices | null>(null);
    const [boostPackages, setBoostPackages] = useState<BoostPackages | null>(null);
    const [selected, setSelected] = useState<BundleSize>(5);
    const [selectedBoost, setSelectedBoost] = useState<'OSON_START' | 'TEZKOR_SAVDO' | 'TURBO_SAVDO'>('TEZKOR_SAVDO');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // URL'dan tab'ni o'qish
        const tab = searchParams.get('tab');
        if (tab === 'reklama') {
            setActiveTab('reklama');
        }
    }, [searchParams]);

    useEffect(() => {
        // E'lon kreditlari narxlarini yuklash
        fetch(`${API_URL}/api/payments/listing-bundles`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) setPrices(res.data);
            })
            .catch(() => setPrices({ bundle5: 50000, bundle10: 90000, bundle20: 160000 }));

        // Reklama paketlari narxlarini yuklash
        fetch(`${API_URL}/api/payments/packages`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) setBoostPackages(res.data);
            })
            .catch(() => setBoostPackages({
                OSON_START: { amount: 41600, originalAmount: 41600, hasDiscount: false },
                TEZKOR_SAVDO: { amount: 85700, originalAmount: 85700, hasDiscount: false },
                TURBO_SAVDO: { amount: 249300, originalAmount: 249300, hasDiscount: false },
            }));
    }, []);

    const bundles: { size: BundleSize; label: string; key: keyof BundlePrices; perUnit: (p: BundlePrices) => number }[] = [
        { size: 5, label: '5 ta e\'lon', key: 'bundle5', perUnit: p => Math.round(p.bundle5 / 5) },
        { size: 10, label: '10 ta e\'lon', key: 'bundle10', perUnit: p => Math.round(p.bundle10 / 10) },
        { size: 20, label: '20 ta e\'lon', key: 'bundle20', perUnit: p => Math.round(p.bundle20 / 20) },
    ];

    const handlePay = async () => {
        if (!prices) return;
        setIsProcessing(true);
        setError('');
        try {
            const result = await createCreditBundleInvoice(selected);
            window.location.href = result.clickUrl;
        } catch (err: any) {
            setError(err.message || "To'lov yaratishda xatolik");
            setIsProcessing(false);
        }
    };

    const handleBoostPay = async () => {
        if (!boostPackages) return;
        setIsProcessing(true);
        setError('');
        try {
            // Hozircha mavjud endpoint'ni ishlatamiz
            // Keyinchalik backend restart qilingandan keyin yangi endpoint ishlatiladi
            setError('Reklama paketini sotib olish uchun backend\'ni restart qiling yoki mavjud e\'lon orqali sotib oling');
            setIsProcessing(false);
        } catch (err: any) {
            setError(err.message || "To'lov yaratishda xatolik");
            setIsProcessing(false);
        }
    };

    const selectedPrice = prices ? prices[`bundle${selected}` as keyof BundlePrices] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 max-w-lg">
                <Link
                    href="/profil/elonlarim"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Orqaga
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('credits')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'credits'
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            E'lon kreditlari
                        </button>
                        <button
                            onClick={() => setActiveTab('reklama')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'reklama'
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            <Megaphone className="w-4 h-4" />
                            Reklama paketlari
                        </button>
                    </div>

                    {activeTab === 'credits' ? (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        E&apos;lon joylash paketi
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Kerakli paketni tanlang
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Paket sotib oling va e&apos;lonlaringizni erkin joylashtiring
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                    <Megaphone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Reklama paketlari
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        E'loningizni ko'proq odamlar ko'rsin
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Reklama paketi bilan e'loningiz boshqalardan ustun turadi va tezroq sotiladi
                            </p>
                        </>
                    )}

                    {/* Content */}
                    {activeTab === 'credits' ? (
                        <>
                            {/* Bundle Options */}
                            <div className="space-y-3 mb-6">
                                {bundles.map(bundle => (
                                    <button
                                        key={bundle.size}
                                        onClick={() => setSelected(bundle.size)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === bundle.size
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected === bundle.size
                                                    ? 'border-primary-500 bg-primary-500'
                                                    : 'border-slate-300 dark:border-slate-600'
                                                    }`}>
                                                    {selected === bundle.size && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {bundle.label}
                                                    </p>
                                                    {prices && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            1 ta = {bundle.perUnit(prices).toLocaleString('uz-UZ')} so&apos;m
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                                {prices ? prices[bundle.key].toLocaleString('uz-UZ') : '...'} so&apos;m
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Kreditlar darhol hisobingizga qo&apos;shiladi
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Kreditlar muddatsiz — istalgan vaqt ishlatishingiz mumkin
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePay}
                                disabled={isProcessing || !prices}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Jarayonda...</>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        {selectedPrice !== null ? `${selectedPrice?.toLocaleString('uz-UZ')} so'm — Click orqali to'lash` : 'Click orqali to\'lov qilish'}
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Reklama Paketlari */}
                            <div className="space-y-3 mb-6">
                                {boostPackages && Object.entries(boostPackages).map(([key, pkg]) => {
                                    const packageKey = key as keyof BoostPackages;
                                    const durations = { OSON_START: 3, TEZKOR_SAVDO: 7, TURBO_SAVDO: 30 };
                                    const labels = { OSON_START: 'OSON START', TEZKOR_SAVDO: 'TEZKOR SAVDO', TURBO_SAVDO: 'TURBO SAVDO' };
                                    const colors = { OSON_START: 'primary', TEZKOR_SAVDO: 'green', TURBO_SAVDO: 'amber' };

                                    return (
                                        <button
                                            key={packageKey}
                                            onClick={() => setSelectedBoost(packageKey)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${selectedBoost === packageKey
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            {packageKey === 'TEZKOR_SAVDO' && (
                                                <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                    Mashhur
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedBoost === packageKey
                                                        ? 'border-primary-500 bg-primary-500'
                                                        : 'border-slate-300 dark:border-slate-600'
                                                        }`}>
                                                        {selectedBoost === packageKey && (
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-lg ${colors[packageKey] === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                                                            colors[packageKey] === 'green' ? 'text-green-600 dark:text-green-400' :
                                                                'text-amber-600 dark:text-amber-400'}`}>
                                                            {labels[packageKey]}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {durations[packageKey]} kun reklama
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                        {(pkg.amount || 0).toLocaleString('uz-UZ')} so&apos;m
                                                    </span>
                                                    {pkg.hasDiscount && (
                                                        <p className="text-xs text-slate-400 line-through">
                                                            {(pkg.originalAmount || 0).toLocaleString('uz-UZ')} so&apos;m
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Reklama Info */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        E'loningiz boshqalardan ustun ko'rinadi
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Ko'proq odamlar ko'radi va tezroq sotiladi
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        TURBO SAVDO paketi bilan e'loningiz "Premium" bo'ladi
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleBoostPay}
                                disabled={isProcessing || !boostPackages}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Jarayonda...</>
                                ) : (
                                    <>
                                        <Megaphone className="w-5 h-5" />
                                        {boostPackages && selectedBoost ?
                                            `${(boostPackages[selectedBoost].amount || 0).toLocaleString('uz-UZ')} so'm — Click orqali to'lash`
                                            : 'Click orqali to\'lov qilish'
                                        }
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PaketlarPage() {
    return (
        <RequireAuth redirectTo="/paketlar">
            <PaketlarContent />
        </RequireAuth>
    );
}
