'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowLeft, CreditCard, Loader2, AlertCircle, CheckCircle, Megaphone } from 'lucide-react';
import { PaymentPackage, apiFetch } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';

const packageInfo = {
    OSON_START: {
        name: 'OSON START',
        duration: '3 kun',
        color: 'text-primary-600',
        bgColor: 'bg-primary-50',
        borderColor: 'border-primary-200',
        features: [
            'E\'lon 3 kun davomida yuqorida ko\'rsatiladi',
            'Oddiy e\'lonlarga nisbatan 3x ko\'proq ko\'riladi',
            'Qidiruv natijalarida birinchi o\'rinlarda'
        ]
    },
    TEZKOR_SAVDO: {
        name: 'TEZKOR SAVDO',
        duration: '7 kun',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        features: [
            'E\'lon 7 kun davomida yuqorida ko\'rsatiladi',
            'Oddiy e\'lonlarga nisbatan 5x ko\'proq ko\'riladi',
            'Telegram kanalida e\'lon qilinadi',
            'Qidiruv natijalarida birinchi o\'rinlarda',
            'Maxsus "Tezkor savdo" belgisi'
        ]
    },
    TURBO_SAVDO: {
        name: 'TURBO SAVDO',
        duration: '30 kun',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        features: [
            'E\'lon 30 kun davomida yuqorida ko\'rsatiladi',
            'Oddiy e\'lonlarga nisbatan 10x ko\'proq ko\'riladi',
            'Telegram kanalida e\'lon qilinadi',
            'Qidiruv natijalarida birinchi o\'rinlarda',
            'Maxsus "Turbo savdo" belgisi',
            'Bosh sahifada maxsus bo\'limda ko\'rsatiladi'
        ]
    }
};

function BoostPaymentPageContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const listingId = params.id as string;
    const packageType = searchParams.get('package') as PaymentPackage;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [packagePrice, setPackagePrice] = useState<number | null>(null);

    useEffect(() => {
        if (!packageType || !packageInfo[packageType]) {
            setError('Noto\'g\'ri paket turi');
            return;
        }

        // Load package price
        const loadPrice = async () => {
            try {
                const data = await apiFetch<{ success: boolean; data: any; message?: string }>('/api/payments/packages');
                if (data.success && data.data && data.data[packageType]) {
                    setPackagePrice(data.data[packageType].amount);
                } else {
                    // Fallback prices
                    const fallbackPrices = {
                        OSON_START: 41600,
                        TEZKOR_SAVDO: 85700,
                        TURBO_SAVDO: 249300
                    };
                    setPackagePrice(fallbackPrices[packageType]);
                }
            } catch (error) {
                console.error('Failed to load package price:', error);
                // Fallback prices
                const fallbackPrices = {
                    OSON_START: 41600,
                    TEZKOR_SAVDO: 85700,
                    TURBO_SAVDO: 249300
                };
                setPackagePrice(fallbackPrices[packageType]);
            }
        };

        loadPrice();
    }, [packageType]);

    const handlePayment = async () => {
        if (!packagePrice) return;

        setIsLoading(true);
        setError('');

        try {
            const data = await apiFetch<{ success: boolean; data: { paymentId: string; amount: number; clickUrl: string }; message?: string }>('/api/payments/boost-package', {
                method: 'POST',
                body: JSON.stringify({
                    listingId,
                    packageType
                }),
            });

            console.log('API Response:', data); // Debug log

            if (!data.success) {
                throw new Error(data.message || 'To\'lov yaratishda xatolik');
            }

            // Redirect to Click payment
            if (data.data && data.data.clickUrl) {
                window.location.href = data.data.clickUrl;
            } else {
                console.error('No clickUrl in response:', data); // Debug log
                throw new Error('To\'lov URL\'i olinmadi');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setError(error.message || 'To\'lov yaratishda xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    if (!packageType || !packageInfo[packageType]) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-900 mb-2">Noto'g'ri paket</h2>
                    <p className="text-red-700 mb-4">Tanlangan paket turi noto'g'ri yoki mavjud emas.</p>
                    <Link href="/profil/elonlarim" className="btn btn-primary">
                        E'lonlarimga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    const info = packageInfo[packageType];

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reklama paketi</h1>
                    <p className="text-slate-500">E'loningizni ko'proq odamlar ko'rsin</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-medium text-red-900 mb-1">Xatolik</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={() => setError('')}
                        className="text-red-400 hover:text-red-600"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Package Info */}
            <div className={`${info.bgColor} ${info.borderColor} border-2 rounded-2xl p-6 mb-6`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <Megaphone className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold ${info.color}`}>{info.name}</h2>
                        <p className="text-slate-600">{info.duration}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className={`text-3xl font-bold ${info.color} mb-2`}>
                        {packagePrice ? `${packagePrice.toLocaleString('uz-UZ')} so'm` : 'Yuklanmoqda...'}
                    </div>
                    <p className="text-slate-600">Bir martalik to'lov</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-3">Paket imkoniyatlari:</h3>
                    {info.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Button */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">To'lov</h3>
                <p className="text-slate-600 mb-6">
                    Click orqali xavfsiz to'lov qiling. To'lov muvaffaqiyatli amalga oshirilgandan so'ng e'loningiz avtomatik ravishda reklama qilinadi.
                </p>

                <button
                    onClick={handlePayment}
                    disabled={isLoading || !packagePrice}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${isLoading || !packagePrice
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                        }`}
                >
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <CreditCard className="w-6 h-6" />
                    )}
                    {isLoading ? 'Yuklanmoqda...' : `${packagePrice ? packagePrice.toLocaleString('uz-UZ') : '...'} so'm to'lash`}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">C</span>
                    Click orqali xavfsiz to'lov
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    💡 <strong>Eslatma:</strong> To'lov muvaffaqiyatli amalga oshirilgandan so'ng e'loningiz avtomatik ravishda tanlangan paket bo'yicha reklama qilinadi. Bekor qilish yoki qaytarish mumkin emas.
                </p>
            </div>
        </div>
    );
}

export default function BoostPaymentPage() {
    return (
        <RequireAuth redirectTo="/auth/login">
            <BoostPaymentPageContent />
        </RequireAuth>
    );
}