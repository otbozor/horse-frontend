'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, FileText, Heart, Plus, Shield, MessageCircle, ChevronRight, Trash2, AlertTriangle, Send, Pencil, Check, X as XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { deleteAccount } from '@/lib/api';

function ProfilPageContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [editingName, setEditingName] = useState(false);
    const [nameValue, setNameValue] = useState('');
    const [savingName, setSavingName] = useState(false);

    async function handleSaveName() {
        if (!nameValue.trim()) return;
        setSavingName(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/me`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayName: nameValue.trim() }),
                }
            );
            if (res.ok) {
                // Update local user display
                if (user) user.displayName = nameValue.trim();
                setEditingName(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingName(false);
        }
    }

    async function handleDeleteAccount() {
        setDeleting(true);
        setDeleteError(null);
        try {
            await deleteAccount();
            logout();
            router.push('/');
        } catch (e: any) {
            setDeleteError(e.message || 'Xatolik yuz berdi');
            setDeleting(false);
        }
    }

    // Redirect admin users to dashboard
    useEffect(() => {
        if (user && user.isAdmin) {
            console.log('👑 Admin user detected, redirecting to admin dashboard...');
            router.push('/admin/dashboard');
        }
    }, [user, router]);

    if (!user) return null;

    console.log('✅ ProfilPage - Rendering with user:', user.displayName);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8 mb-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.displayName}
                                    width={96}
                                    height={96}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
                                        {user.displayName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                {editingName ? (
                                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                        <input
                                            autoFocus
                                            value={nameValue}
                                            onChange={e => setNameValue(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                                            className="flex-1 text-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-1.5 outline-none border-2 border-primary-400 min-w-0"
                                        />
                                        <button onClick={handleSaveName} disabled={savingName} className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 flex-shrink-0">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingName(false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 flex-shrink-0">
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-1 sm:mb-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {user.displayName}
                                        </h1>
                                        <button
                                            onClick={() => { setNameValue(user.displayName); setEditingName(true); }}
                                            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 flex-shrink-0"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                                {user.telegramUsername && (
                                    <p className="text-slate-600 dark:text-slate-400 mb-2 truncate">
                                        @{user.telegramUsername}
                                    </p>
                                )}
                                {user.isVerified && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                        ✓ Tasdiqlangan
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    {/* Top row: 2 squares */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Link
                            href="/elon/yaratish"
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:border-amber-400 transition-colors group flex flex-col items-center justify-center text-center gap-2 h-28"
                        >
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                                    E'lon joylash
                                </h3>
                            </div>
                        </Link>

                        <Link
                            href="/profil/sevimlilar"
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:border-rose-400 transition-colors group flex flex-col items-center justify-center text-center gap-2 h-28"
                        >
                            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                                    Sevimlilar
                                </h3>
                            </div>
                        </Link>
                    </div>

                    {/* Bottom row: full-width horizontal link */}
                    <div className="space-y-3">
                        <Link
                            href="/profil/elonlarim"
                            className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:border-primary-500 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">
                                    Mening e&apos;lonlarim
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Barcha e&apos;lonlaringizni ko&apos;ring va tahrirlang
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        </Link>

                    </div>

                    {/* Settings & Help */}
                    <div className="mt-6">
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
                            Sozlamalar va yordam
                        </p>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                            <a href="https://t.me/otbozor_uz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="w-9 h-9 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Send className="w-4 h-4 text-sky-500" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">Telegram kanal</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </a>
                            <Link href="/terms" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">Joylashtirish qoidalari</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                            <Link href="/privacy" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">Maxfiylik siyosati</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                            <Link href="/aloqa" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">Biz bilan aloqa</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Logout + Delete buttons */}
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Chiqish
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hisobni o&apos;chirish
                        </button>
                    </div>

                    {/* Mini footer */}
                    <div className="mt-8 mb-6 text-center">
                        <div className="flex justify-center gap-6 mb-2 flex-wrap">
                            <Link href="/aloqa" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                                Biz haqimizda
                            </Link>
                            <Link href="/aloqa" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                                Qo&apos;llab-quvvatlash
                            </Link>
                        </div>
                        <div className="mb-5">
                            <Link href="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                                Sayt qoidalari
                            </Link>
                        </div>
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-4">
                            Biz ijtimoiy tarmoqlarda
                        </p>
                        <div className="flex justify-center gap-4 mb-5">
                            <a href="https://t.me/otbozor_uz" target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:border-sky-400 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-sky-500"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            </a>
                            <a href="https://instagram.com/otbozor.uz" target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:border-pink-400 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-700 dark:fill-slate-300"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                            </a>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            © {new Date().getFullYear()} Otbozor.uz
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-sm">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
                            Hisobni o&apos;chirish
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                            Hisobingiz va barcha e&apos;lonlaringiz butunlay o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.
                        </p>
                        {deleteError && (
                            <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">{deleteError}</p>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteError(null); }}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProfilPage() {
    return (
        <RequireAuth redirectTo="/profil">
            <ProfilPageContent />
        </RequireAuth>
    );
}
