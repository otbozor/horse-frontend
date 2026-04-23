'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Megaphone } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { RequireAuth } from '@/components/auth/RequireAuth';

function BoostPaymentResultPageContent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const listingId = params.id as string;
    const paymentId = searchParams.get('paymentId');

    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'COMPLETED' | 'FAILED' | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!paymentId) {
            setError('To\'lov ID topilmadi');
            setIsLoading(false);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const data = await apiFetch<{ success: boolean; data: any; message?: string }>(`/api/payments/status/${paymentId}`);

                if (!data.success) {
                    throw new Error(data.message || 'To\'lov holatini tekshirishda xatolik');
                }

                setPaymentData(data.data);
                setPaymentStatus(data.data.status);
            } catch (error: any) {
                console.error('Payment status check error:', error);
                setError(error.message || 'To\'lov holatini tekshirishda xatolik yuz berdi');
            } finally {
                setIsLoading(false);
            }
        };

        checkPaymentStatus();

        // Poll payment status every 3 seconds if still pending
        const interval = setInterval(() => {
            if (paymentStatus === 'PENDING') {
                checkPaymentStatus();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [paymentId, paymentStatus]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">To'lov holatini tekshirmoqda...</h2>
                    <p className="text-slate-500">Iltimos kuting</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-900 mb-2">Xatolik</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <Link href="/profil/elonlarim" className="btn btn-primary">
                        E'lonlarimga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push('/profil/elonlarim')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">To'lov natijasi</h1>
                    <p className="text-slate-500">Reklama paketi to'lovi</p>
                </div>
            </div>

            {/* Payment Status */}
            {paymentStatus === 'COMPLETED' && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">To'lov muvaffaqiyatli!</h2>
                    <p className="text-green-700 mb-6">
                        Reklama paketi muvaffaqiyatli sotib olindi. E'loningiz endi reklama qilinadi.
                    </p>

                    {paymentData && (
                        <div className="bg-white rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <span className="block text-slate-500 text-sm mb-1">Paket</span>
                                    <span className="font-semibold text-slate-900">
                                        {paymentData.packageType === 'OSON_START' && 'OSON START'}
                                        {paymentData.packageType === 'TEZKOR_SAVDO' && 'TEZKOR SAVDO'}
                                        {paymentData.packageType === 'TURBO_SAVDO' && 'TURBO SAVDO'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-sm mb-1">Summa</span>
                                    <span className="font-semibold text-slate-900">
                                        {paymentData.amount?.toLocaleString('uz-UZ')} so'm
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-sm mb-1">Sana</span>
                                    <span className="font-semibold text-slate-900">
                                        {new Date(paymentData.createdAt).toLocaleDateString('uz-UZ')}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-sm mb-1">Holat</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        To'langan
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={`/ot/${listingId}`}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Megaphone className="w-5 h-5" />
                            E'lonni ko'rish
                        </Link>
                        <Link
                            href="/profil/elonlarim"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            E'lonlarimga qaytish
                        </Link>
                    </div>
                </div>
            )}

            {paymentStatus === 'FAILED' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-6">
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-900 mb-2">To'lov amalga oshmadi</h2>
                    <p className="text-red-700 mb-6">
                        To'lov jarayonida xatolik yuz berdi. Iltimos qayta urinib ko'ring.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => router.push(`/elon/${listingId}/reklama-tolov`)}
                            className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Qayta urinish
                        </button>
                        <Link
                            href="/profil/elonlarim"
                            className="flex-1 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            E'lonlarimga qaytish
                        </Link>
                    </div>
                </div>
            )}

            {paymentStatus === 'PENDING' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center mb-6">
                    <Loader2 className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">To'lov kutilmoqda</h2>
                    <p className="text-amber-700 mb-6">
                        To'lov hali ham jarayonda. Iltimos bir oz kuting.
                    </p>

                    <div className="bg-white rounded-xl p-4 mb-6">
                        <p className="text-sm text-slate-600">
                            To'lov holatini avtomatik tekshirmoqdamiz. Sahifani yangilash shart emas.
                        </p>
                    </div>

                    <Link
                        href="/profil/elonlarim"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                        E'lonlarimga qaytish
                    </Link>
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    💡 <strong>Eslatma:</strong> To'lov muvaffaqiyatli amalga oshirilgandan so'ng e'loningiz avtomatik ravishda reklama qilinadi va ko'proq odamlar tomonidan ko'riladi.
                </p>
            </div>
        </div>
    );
}

export default function BoostPaymentResultPage() {
    return (
        <RequireAuth redirectTo="/auth/login">
            <BoostPaymentResultPageContent />
        </RequireAuth>
    );
}