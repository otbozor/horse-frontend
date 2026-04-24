'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
            <div className="max-w-2xl w-full text-center">
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

                {/* 404 Animation */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-slate-900 dark:text-white mb-4 animate-bounce">
                        404
                    </h1>
                    <div className="text-6xl mb-4">🐴</div>
                </div>

                {/* Message */}
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Sahifa topilmadi
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-primary-500/30"
                    >
                        <Home className="w-5 h-5" />
                        Bosh sahifa
                    </Link>

                    <Link
                        href="/bozor"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        E'lonlarni ko'rish
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Orqaga qaytish
                    </button>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Mashhur sahifalar:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/bozor"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Ot bozori
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <Link
                            href="/kopkari"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Ko'pkari
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <Link
                            href="/mahsulotlar"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Mahsulotlar
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <Link
                            href="/blog"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Blog
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <Link
                            href="/aloqa"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            Aloqa
                        </Link>
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        💡 <strong>Qiziq fakt:</strong> O'zbekistonda 100,000 dan ortiq ot bor va ko'pkari milliy o'yinimizdir!
                    </p>
                </div>
            </div>
        </div>
    );
}
