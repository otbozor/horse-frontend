'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, User, Plus, Sun, Moon, LogOut, Heart, FileText, Shield } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/components/providers/AuthProvider';

const navigation = [
    { name: 'Bozor', href: '/bozor' },
    { name: "Ko'pkari", href: '/kopkari' },
    { name: 'Mahsulotlar', href: '/mahsulotlar' },
    { name: 'Blog', href: '/blog' },
    { name: 'Aloqa', href: '/aloqa' },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Otbozor" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Ot<span className="text-primary-600 dark:text-primary-400">bozor</span>
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link href="/elon/yaratish" className="btn btn-primary">
                                    <Plus className="w-4 h-4" />
                                    E'lon joylash
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        {user?.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.displayName}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                                                {user?.displayName?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                                    </button>

                                    {userMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setUserMenuOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20">
                                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                        {user?.displayName}
                                                    </p>
                                                    {user?.telegramUsername && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            @{user.telegramUsername}
                                                        </p>
                                                    )}
                                                </div>

                                                <Link
                                                    href="/profil"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profil
                                                </Link>

                                                <Link
                                                    href="/profil/elonlarim"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Mening e'lonlarim
                                                </Link>

                                                <Link
                                                    href="/profil/sevimlilar"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Heart className="w-4 h-4" />
                                                    Sevimlilar
                                                </Link>

                                                {user?.isAdmin && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Shield className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                )}

                                                <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            logout();
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Chiqish
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-ghost">
                                    <User className="w-4 h-4" />
                                    Kirish
                                </Link>
                                <Link href="/elon/yaratish" className="btn btn-primary">
                                    <Plus className="w-4 h-4" />
                                    E'lon joylash
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        )}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col gap-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 py-2.5 text-slate-600 hover:text-primary-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800 rounded-lg font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            <button
                                onClick={toggleTheme}
                                className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg font-medium flex items-center gap-2"
                            >
                                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <Link
                                href="/login"
                                className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kirish
                            </Link>
                            <Link
                                href="/elon/yaratish"
                                className="mx-4 btn btn-primary justify-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Plus className="w-4 h-4" />
                                E'lon joylash
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
                <Link
                    href="/elon/yaratish"
                    className="btn btn-primary btn-lg w-full justify-center"
                >
                    <Plus className="w-5 h-5" />
                    E'lon joylash
                </Link>
            </div>
        </header>
    );
}
