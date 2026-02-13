'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Rocket, Crown, Check, Star } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface Package {
    id: string;
    name: string;
    price: number;
    icon: React.ReactNode;
    color: string;
    bgGradient: string;
    borderColor: string;
    popular?: boolean;
    features: string[];
}

const PACKAGES: Package[] = [
    {
        id: 'oson_start',
        name: 'Oson start',
        price: 41600,
        icon: <Zap className="w-6 h-6" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgGradient: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
        features: [
            "3 kun TOP'da joylashtirish",
        ],
    },
    {
        id: 'tezkor_savdo',
        name: 'Tezkor savdo',
        price: 85700,
        icon: <Rocket className="w-6 h-6" />,
        color: 'text-primary-600 dark:text-primary-400',
        bgGradient: 'from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20',
        borderColor: 'border-primary-300 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-600',
        popular: true,
        features: [
            "7 kun TOP'da joylashtirish",
            '3 marta ko\'tarish',
        ],
    },
    {
        id: 'turbo_savdo',
        name: 'Turbo savdo',
        price: 249300,
        icon: <Crown className="w-6 h-6" />,
        color: 'text-amber-600 dark:text-amber-400',
        bgGradient: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700',
        features: [
            "30 kun TOP'da joylashtirish",
            '9 marta ko\'tarish',
            "7 kun VIP e'lonlarda",
        ],
    },
];

function PaymentPageContent() {
    const params = useParams();
    const listingId = params.id as string;
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectPackage = (pkg: Package) => {
        setSelectedPackage(pkg.id);
    };

    const handlePay = async () => {
        if (!selectedPackage) return;
        setIsProcessing(true);

        // TODO: integrate with actual payment gateway (Payme, Click, etc.)
        // For now, show a placeholder
        alert("To'lov tizimi tez orada ulanadi. Hozircha admin bilan bog'laning.");
        setIsProcessing(false);
    };

    const selected = PACKAGES.find(p => p.id === selectedPackage);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 sm:py-10">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                {/* Back */}
                <Link
                    href="/profil/elonlarim"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    E&apos;lonlarimga qaytish
                </Link>

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Tarifni tanlang
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                        E&apos;loningizni ko&apos;proq odamlarga yetkazing
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
                    {PACKAGES.map((pkg) => {
                        const isSelected = selectedPackage === pkg.id;
                        return (
                            <button
                                key={pkg.id}
                                onClick={() => handleSelectPackage(pkg)}
                                className={`relative text-left rounded-2xl border-2 p-5 sm:p-6 transition-all bg-gradient-to-b ${pkg.bgGradient} ${
                                    isSelected
                                        ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20 dark:ring-primary-400/20 scale-[1.02]'
                                        : pkg.borderColor
                                }`}
                            >
                                {/* Popular Badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                                            <Star className="w-3 h-3 fill-current" />
                                            ENG MASHHUR
                                        </span>
                                    </div>
                                )}

                                {/* Icon & Name */}
                                <div className={`mb-4 ${pkg.popular ? 'mt-2' : ''}`}>
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm mb-3 ${pkg.color}`}>
                                        {pkg.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {pkg.name}
                                    </h3>
                                </div>

                                {/* Price */}
                                <div className="mb-5">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                                        {pkg.price.toLocaleString('uz-UZ')}
                                    </span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">so&apos;m</span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-2.5">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${pkg.color}`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4">
                                        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Pay Button */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            {selected ? (
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Tanlangan tarif:</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {selected.name} — {selected.price.toLocaleString('uz-UZ')} so&apos;m
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400">
                                    Yuqoridagi tariflardan birini tanlang
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handlePay}
                            disabled={!selectedPackage || isProcessing}
                            className="w-full sm:w-auto btn btn-primary px-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Jarayonda...
                                </span>
                            ) : (
                                "To'lov qilish"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <RequireAuth redirectTo="/profil/elonlarim">
            <PaymentPageContent />
        </RequireAuth>
    );
}
