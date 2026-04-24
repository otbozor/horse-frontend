'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function MagicLinkContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token topilmadi. Iltimos, qaytadan urinib ko\'ring.');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/auth/magic`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('Muvaffaqiyatli login qildingiz! Sahifaga yo\'naltirilmoqda...');

                    // Check if user is admin
                    const meResponse = await fetch(`${apiUrl}/api/auth/me`, {
                        credentials: 'include',
                    });
                    const meData = await meResponse.json();

                    setTimeout(() => {
                        if (meData.success && meData.data?.isAdmin) {
                            router.push('/admin/dashboard');
                        } else {
                            router.push('/profil');
                        }
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Magic link yaroqsiz yoki muddati tugagan.');
                }
            } catch (error) {
                console.error('Magic link verification error:', error);
                setStatus('error');
                setMessage('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
            }
        };

        verifyToken();
    }, [token, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-4 py-12">
            <div className="w-full max-w-md text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Otbozor"
                            width={80}
                            height={80}
                            className="dark:invert"
                        />
                    </Link>
                </div>

                {/* Status Icon */}
                <div className="mb-6">
                    {status === 'loading' && (
                        <div className="w-20 h-20 mx-auto bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-spin" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-20 h-20 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {status === 'loading' && 'Tekshirilmoqda...'}
                    {status === 'success' && 'Muvaffaqiyatli!'}
                    {status === 'error' && 'Xatolik'}
                </h1>

                {/* Message */}
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                    {message}
                </p>

                {/* Actions */}
                {status === 'error' && (
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="block w-full h-12 flex items-center justify-center bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-semibold text-sm transition-colors"
                        >
                            Qaytadan urinish
                        </Link>
                        <Link
                            href="/"
                            className="block text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            Bosh sahifaga qaytish
                        </Link>
                    </div>
                )}

                {status === 'loading' && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        Iltimos, kuting...
                    </p>
                )}
            </div>
        </div>
    );
}

export default function MagicLinkPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            }
        >
            <MagicLinkContent />
        </Suspense>
    );
}
