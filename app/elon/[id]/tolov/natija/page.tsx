'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, Eye } from 'lucide-react';
import { getPaymentStatus } from '@/lib/api';

const PACKAGE_NAMES: Record<string, string> = {
    OSON_START: 'Oson start',
    TEZKOR_SAVDO: 'Tezkor savdo',
    TURBO_SAVDO: 'Turbo savdo',
};

function PaymentResultContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const listingId = params.id as string;
    const paymentId = searchParams.get('paymentId');

    const [status, setStatus] = useState<'loading' | 'completed' | 'pending' | 'failed'>('loading');
    const [payment, setPayment] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!paymentId) {
            setStatus('failed');
            setError("To'lov ID topilmadi");
            return;
        }

        const checkStatus = async () => {
            try {
                const data = await getPaymentStatus(paymentId);
                setPayment(data);
                if (data.status === 'COMPLETED') setStatus('completed');
                else if (data.status === 'FAILED' || data.status === 'CANCELLED') setStatus('failed');
                else setStatus('pending');
            } catch (err: any) {
                setStatus('failed');
                setError(err.message || "To'lov holati tekshirishda xatolik");
            }
        };

        checkStatus();

        // Poll every 5 seconds if pending
        const interval = setInterval(async () => {
            try {
                const data = await getPaymentStatus(paymentId);
                setPayment(data);
                if (data.status === 'COMPLETED') {
                    setStatus('completed');
                    clearInterval(interval);
                } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
                    setStatus('failed');
                    clearInterval(interval);
                }
            } catch { clearInterval(interval); }
        }, 5000);

        return () => clearInterval(interval);
    }, [paymentId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">To'lov tekshirilmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {status === 'completed' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            To'lov muvaffaqiyatli!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            E'loningiz premium ro'yxatga qo'shildi va bosh sahifada ko'rinadi.
                        </p>

                        {payment && (
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Tarif:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {PACKAGE_NAMES[payment.packageType] || payment.packageType}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">To'lov summasi:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {Number(payment.amount).toLocaleString('uz-UZ')} so'm
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/ot/${payment?.listing?.slug || listingId}`}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                E'lonni ko'rish
                            </Link>
                            <Link
                                href="/profil/elonlarim"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors"
                            >
                                E'lonlarimga qaytish
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            To'lov tekshirilmoqda
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            To'lovingiz qayta ishlanmoqda. Biroz kuting...
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Avtomatik yangilanmoqda
                        </div>
                        <Link
                            href="/profil/elonlarim"
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            E'lonlarimga qaytish
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            To'lov amalga oshmadi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {error || "To'lov bekor qilindi yoki xato yuz berdi."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/elon/${listingId}/tolov`}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Qayta urinish
                            </Link>
                            <Link
                                href="/profil/elonlarim"
                                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium"
                            >
                                E'lonlarimga qaytish
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    );
}
