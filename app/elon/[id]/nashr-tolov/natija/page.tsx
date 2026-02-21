'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

function NashrNatijaContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');
    const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!paymentId) { setStatus('failed'); return; }

        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const check = async () => {
            try {
                const res = await fetch(`${API_URL}/api/payments/status/${paymentId}`, {
                    credentials: 'include',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();
                if (data.success && data.data?.status === 'COMPLETED') setStatus('success');
                else if (data.data?.status === 'CANCELLED') setStatus('failed');
                else setStatus('pending');
            } catch {
                setStatus('pending');
            }
        };

        check();
        const interval = setInterval(check, 3000);
        return () => clearInterval(interval);
    }, [paymentId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        To&apos;lov muvaffaqiyatli!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        E&apos;loningiz moderatorga yuborildi. Tasdiqlangandan so&apos;ng faol bo&apos;ladi.
                    </p>
                    <Link href="/profil/elonlarim" className="btn btn-primary w-full justify-center">
                        Mening e&apos;lonlarim
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">To&apos;lov bekor qilindi</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">To&apos;lov amalga oshmadi. Qayta urinib ko&apos;ring.</p>
                    <Link href="/profil/elonlarim" className="btn btn-outline w-full justify-center">
                        Mening e&apos;lonlarim
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">To&apos;lov tekshirilmoqda</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Biroz kuting...</p>
                <Link href="/profil/elonlarim" className="btn btn-outline w-full justify-center">
                    Mening e&apos;lonlarim
                </Link>
            </div>
        </div>
    );
}

export default function NashrNatijaPage() {
    return (
        <RequireAuth redirectTo="/profil/elonlarim">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>}>
                <NashrNatijaContent />
            </Suspense>
        </RequireAuth>
    );
}
