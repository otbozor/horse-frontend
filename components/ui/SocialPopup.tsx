'use client';

import { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const STORAGE_KEY = 'social_popup_last_shown';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function SocialPopup() {
    const [visible, setVisible] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Admin panelda popup ko'rsatilmasin
        if (window.location.pathname.startsWith('/admin')) {
            return;
        }

        // Admin userlar uchun popup ko'rsatilmasin
        if (user?.isAdmin) {
            return;
        }

        try {
            const last = localStorage.getItem(STORAGE_KEY);
            if (last && Date.now() - Number(last) < ONE_DAY_MS) return;
        } catch { }
        setVisible(true);
    }, [user]);

    const close = () => {
        try {
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch { }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
            <div className="absolute top-48 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full p-6 border border-slate-200 dark:border-slate-700">
                    {/* Close button */}

                    <button
                        onClick={close}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full 
               text-red-500  bg-red-100  border border-red-500 
               hover:bg-red-500 hover:text-white 
               transition-colors"
                        aria-label="Yopish"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Logo / Title */}
                    <div className="text-center mb-5">
                        <div className="w-16 h-16 mx-auto mb-3">
                            <img src="/logo.png" alt="Otbozor" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Biz bilan bog'laning!
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Yangi e'lonlar va yangiliklardan xabardor bo'ling
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://t.me/otbozor_rasmiy"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={close}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bbf] text-white font-medium transition-colors"
                        >
                            <Send className="w-5 h-5 shrink-0" />
                            <div className="text-left">
                                <div className="text-sm font-semibold">Telegram kanal</div>
                                <div className="text-xs opacity-80">@otbozor_rasmiy</div>
                            </div>
                        </a>

                        <a
                            href="https://www.instagram.com/otbozor.uz"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={close}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-medium transition-opacity"
                        >
                            {/* Instagram icon */}
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-sm font-semibold">Instagram</div>
                                <div className="text-xs opacity-80">@otbozor.uz</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
