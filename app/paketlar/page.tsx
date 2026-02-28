'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { createCreditBundleInvoice } from '@/lib/api';

type BundleSize = 5 | 10 | 20;

interface BundlePrices {
    bundle5: number;
    bundle10: number;
    bundle20: number;
}

function PaketlarContent() {
    const [prices, setPrices] = useState<BundlePrices | null>(null);
    const [selected, setSelected] = useState<BundleSize>(5);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/payments/listing-bundles`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data) setPrices(res.data);
            })
            .catch(() => setPrices({ bundle5: 50000, bundle10: 90000, bundle20: 160000 }));
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

                    {/* Bundle Options */}
                    <div className="space-y-3 mb-6">
                        {bundles.map(bundle => (
                            <button
                                key={bundle.size}
                                onClick={() => setSelected(bundle.size)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                    selected === bundle.size
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                            selected === bundle.size
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
