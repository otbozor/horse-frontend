'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { startTelegramAuth, verifyCode, getCurrentUser, apiFetch } from '@/lib/api';

const IS_DEV = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.hostname === 'localhost');

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'start' | 'verify'>('start');
    const [error, setError] = useState('');
    const [devPhone, setDevPhone] = useState('+998901234567');
    const [devLoading, setDevLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/profil';

    const handleDevLogin = async () => {
        setDevLoading(true);
        setError('');
        try {
            const response = await apiFetch<{ success: boolean; data?: { tokens: { accessToken: string; refreshToken: string } } }>('/api/auth/dev-login', {
                method: 'POST',
                body: JSON.stringify({ phone: devPhone, displayName: 'Test Foydalanuvchi' }),
            });
            if (response.data?.tokens) {
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
            }
            window.location.href = returnUrl;
        } catch (err: any) {
            setError(err.message || 'Dev login xatolik');
        } finally {
            setDevLoading(false);
        }
    };

    const startLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await startTelegramAuth(window.location.origin);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Login boshlashda xatolik');
            }

            // Telegram botga yo'naltirish
            window.open(response.data.botDeepLink, '_blank');

            // Code kiritish bosqichiga o'tish
            setStep('verify');
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (code.length !== 8) {
            setError('Code 8 ta belgidan iborat bo\'lishi kerak');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('🔐 Verifying code:', code);
            const response = await verifyCode(code);
            console.log('📡 Verify response:', response);

            if (!response.success) {
                throw new Error(response.message || 'Code noto\'g\'ri yoki muddati o\'tgan');
            }

            // Save tokens to localStorage
            if (response.data?.tokens) {
                console.log('💾 Saving tokens to localStorage...');
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                console.log('✅ Tokens saved:', {
                    accessToken: response.data.tokens.accessToken.substring(0, 20) + '...',
                    refreshToken: response.data.tokens.refreshToken.substring(0, 20) + '...',
                });
            }

            console.log('🔄 Redirecting to:', returnUrl);

            // Check if user is admin and redirect accordingly
            // We need to fetch user info to check if admin
            const userResponse = await getCurrentUser();
            if (userResponse.success && userResponse.data?.isAdmin) {
                console.log('👑 Admin user detected, redirecting to admin dashboard');
                window.location.href = '/admin/dashboard';
            } else {
                console.log('👤 Regular user, redirecting to:', returnUrl);
                window.location.href = returnUrl;
            }
        } catch (err: any) {
            console.error('❌ Verify error:', err);
            setError(err.message || 'Tasdiqlashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            Otbozor
                        </h1>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {step === 'start' ? (
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    Tizimga kirish
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Telegram orqali xavfsiz kirish
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={startLogin}
                                disabled={loading}
                                className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Yuklanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" />
                                        Telegram orqali kirish
                                    </>
                                )}
                            </button>

                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                    Telegram orqali kirishda quyidagi ma'lumotlar tasdiqlanadi:
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Telegram username
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Telefon raqami (ixtiyoriy)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Tasdiqlanganlik holati
                                    </li>
                                </ul>
                            </div>


                        </div>
                    ) : (
                        <div className="p-8">
                            <button
                                onClick={() => setStep('start')}
                                className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Orqaga
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🔐</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    Tasdiqlash kodi
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Telegram botdan olgan 8 ta belgidan iborat kodni kiriting
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 text-center">
                                    Tasdiqlash kodi
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                        setCode(val);
                                        setError('');
                                    }}
                                    placeholder="AB12CD34"
                                    maxLength={8}
                                    className="w-full px-6 py-5 text-center text-3xl font-bold font-mono tracking-[0.5em] border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
                                    style={{ letterSpacing: '0.5em' }}
                                    autoFocus
                                />
                                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                                    Telegram botdan kelgan 8 belgili kodni kiriting
                                </p>
                            </div>

                            <button
                                onClick={handleVerifyCode}
                                disabled={loading || code.length !== 8}
                                className="w-full btn btn-primary btn-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Tekshirilmoqda...
                                    </span>
                                ) : (
                                    'Tasdiqlash'
                                )}
                            </button>

                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    <strong>Eslatma:</strong> Agar kod kelmagan bo'lsa, Telegram botni tekshiring yoki qaytadan urinib ko'ring.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        Bosh sahifaga qaytish
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
