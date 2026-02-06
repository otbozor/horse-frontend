'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { User, LogOut, FileText, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ProfilPage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('👤 ProfilPage - Auth State:', { user: !!user, isAdmin: user?.isAdmin, isLoading });

        // If user is admin, redirect to admin dashboard
        if (!isLoading && user && user.isAdmin) {
            console.log('👑 Admin user detected, redirecting to admin dashboard...');
            router.push('/admin/dashboard');
            return;
        }

        if (!isLoading && !user) {
            console.log('❌ No user, redirecting to login...');
            router.push('/login?returnUrl=/profil');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        console.log('⏳ ProfilPage - Loading...');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('❌ ProfilPage - No user, will redirect...');
        return null; // Will redirect via useEffect
    }

    console.log('✅ ProfilPage - Rendering with user:', user.displayName);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                        <div className="flex items-center gap-6">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.displayName}
                                    className="w-24 h-24 rounded-full"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                        {user.displayName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    {user.displayName}
                                </h1>
                                {user.telegramUsername && (
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                                        @{user.telegramUsername}
                                    </p>
                                )}
                                {user.isVerified && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                        ✓ Tasdiqlangan
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Chiqish
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/profil/elonlarim"
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary-500 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Mening e'lonlarim
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Barcha e'lonlaringizni ko'ring va tahrirlang
                            </p>
                        </Link>

                        <Link
                            href="/profil/sevimlilar"
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary-500 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Sevimlilar
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Yoqtirgan e'lonlaringiz
                            </p>
                        </Link>

                        <Link
                            href="/elon/yaratish"
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-primary-500 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">➕</span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Yangi e'lon
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                E'lon joylashtirish
                            </p>
                        </Link>
                    </div>

                    {/* Success Message */}
                    <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl">
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                            🎉 Login Muvaffaqiyatli!
                        </h3>
                        <p className="text-green-700 dark:text-green-300">
                            Endi siz e'lon yaratishingiz va platformaning barcha imkoniyatlaridan foydalanishingiz mumkin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
