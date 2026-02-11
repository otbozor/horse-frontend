'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!username || !password) {
                throw new Error('Username va parol talab qilinadi');
            }

            console.log('🔐 Admin login attempt:', username);
            const response = await adminLogin(username, password);
            console.log('📡 Admin login response:', response);

            if (!response.success) {
                const msg = response.message;
                if (msg === 'Unauthorized' || msg?.toLowerCase().includes('unauthorized')) {
                    throw new Error("Login yoki parol noto'g'ri");
                }
                throw new Error(msg || 'Login muvaffaqiyatsiz');
            }

            // Save tokens to localStorage
            if (response.data?.tokens) {
                console.log('💾 Saving admin tokens to localStorage...');
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
                console.log('✅ Admin tokens saved');
            }

            console.log('🔄 Redirecting to admin dashboard...');
            // Muvaffaqiyatli login - force reload to refresh AuthProvider
            window.location.href = '/admin/dashboard';
        } catch (err: any) {
            console.error('❌ Admin login error:', err);
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white">
                            Otbozor
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Admin Panel</p>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Admin Kirish
                            </h2>
                            <p className="text-slate-400">
                                Faqat admin foydalanuvchilar uchun
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="admin"
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Parol
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Yuklanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Kirish
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <p className="text-xs text-slate-500 text-center">
                                Ushbu sahifa faqat admin foydalanuvchilar uchun mo'ljallangan.
                                <br />
                                Ruxsatsiz kirish urinishlari qayd etiladi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        Bosh sahifaga qaytish
                    </Link>
                </div>
            </div>
        </div>
    );
}
