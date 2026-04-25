'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { submitListingForReview, PaymentRequiredError } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';

function ReklamaTanlashContent() {
    const router = useRouter();
    const params = useParams();
    const listingId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [packagePrices, setPackagePrices] = useState<any>(null);

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/packages`,
                );
                const data = await response.json();
                if (data.success && data.data) {
                    setPackagePrices(data.data);
                }
            } catch (error) {
                console.error('Failed to load prices:', error);
            }
        };
        loadPrices();
    }, []);

    const handleWithoutAds = async () => {
        setLoading(true);
        try {
            await submitListingForReview(listingId);
            router.push('/profil/elonlarim?success=true');
        } catch (error: any) {
            if (error instanceof PaymentRequiredError) {
                router.push(`/elon/${listingId}/nashr-tolov`);
            } else {
                alert(error.message || 'Xatolik yuz berdi');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleWithAds = () => {
        if (!selectedPackage) {
            alert('Iltimos, paket tanlang');
            return;
        }
        router.push(`/elon/${listingId}/reklama-tolov?package=${selectedPackage}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Back button */}
                <Link
                    href="/profil/elonlarim"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    E'lonlarimga qaytish
                </Link>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                        Tarifni tanlang
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        E'loningizni ko'proq odamlarga yetkazing
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    {/* OSON START */}
                    <button
                        onClick={() => setSelectedPackage('OSON_START')}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedPackage === 'OSON_START'
                            ? 'border-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50 bg-blue-50 dark:bg-blue-900/20 scale-105'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-white dark:bg-slate-800 hover:scale-105'
                            }`}
                    >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                            Oson start
                        </div>
                        <div className="mb-1">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {packagePrices?.OSON_START
                                    ? packagePrices.OSON_START.amount.toLocaleString('uz-UZ')
                                    : '41,600'}{' '}
                                <span className="text-sm text-slate-500">so'm</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 mt-3">
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>3 kun TOP'da joylashtirish</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>2x ko'proq ko'rishlar</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>Tezroq sotish imkoniyati</span>
                            </div>
                        </div>
                    </button>

                    {/* TEZKOR SAVDO */}
                    <button
                        onClick={() => setSelectedPackage('TEZKOR_SAVDO')}
                        className={`p-4 rounded-lg border-2 transition-all relative text-left ${selectedPackage === 'TEZKOR_SAVDO'
                            ? 'border-green-500 ring-4 ring-green-100 dark:ring-green-900/50 bg-green-50 dark:bg-green-900/20 scale-105'
                            : 'border-green-400 dark:border-green-600 hover:border-green-500 bg-white dark:bg-slate-800 hover:scale-105'
                            }`}
                    >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-lg">
                            ENG MASHHUR
                        </div>
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                            Tezkor savdo
                        </div>
                        <div className="mb-1">
                            <div className="text-xs text-slate-400 line-through mb-0.5">
                                85,700 so'm
                            </div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {packagePrices?.TEZKOR_SAVDO
                                    ? packagePrices.TEZKOR_SAVDO.amount.toLocaleString('uz-UZ')
                                    : '80,000'}{' '}
                                <span className="text-sm text-slate-500">so'm</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 mt-3">
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>7 kun TOP'da joylashtirish</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>4x ko'proq ko'rishlar</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>Qidiruv natijalarida birinchi</span>
                            </div>
                        </div>
                    </button>

                    {/* PREMIUM */}
                    <button
                        onClick={() => setSelectedPackage('TURBO_SAVDO')}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${selectedPackage === 'TURBO_SAVDO'
                            ? 'border-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/50 bg-amber-50 dark:bg-amber-900/20 scale-105'
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 bg-white dark:bg-slate-800 hover:scale-105'
                            }`}
                    >
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15 8L21 9L16.5 13.5L18 20L12 16.5L6 20L7.5 13.5L3 9L9 8L12 2Z" />
                            </svg>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                            Premium
                        </div>
                        <div className="mb-1">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {packagePrices?.TURBO_SAVDO
                                    ? packagePrices.TURBO_SAVDO.amount.toLocaleString('uz-UZ')
                                    : '249,300'}{' '}
                                <span className="text-sm text-slate-500">so'm</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 mt-3">
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>30 kun TOP'da joylashtirish</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>10x ko'proq ko'rishlar</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>Premium sotuvchi nishoni</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Yuqoridagi tariflardan birini tanlang
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleWithAds}
                                disabled={!selectedPackage || loading}
                                className="h-12 px-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg disabled:shadow-none"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "To'lov qilish"
                                )}
                            </button>

                            <button
                                onClick={handleWithoutAds}
                                disabled={loading}
                                className="h-12 px-6 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-medium transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Reklamasiz davom etish'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReklamaTanlashPage() {
    return (
        <RequireAuth>
            <ReklamaTanlashContent />
        </RequireAuth>
    );
}
