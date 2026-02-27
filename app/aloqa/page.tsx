'use client';

import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, Clock } from 'lucide-react';

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero banner */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Orqaga
                    </button>
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Biz bilan bog'laning
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400">
                            Savolingiz bormi? Taklif yoki shikoyatingiz bormi? Biz doim yordam berishga tayyormiz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

                    {/* Left: Contact cards */}
                    <div className="space-y-4">
                        {/* Telefon */}
                        <a
                            href="tel:+998973027750"
                            className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Telefon</p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    +998 (97) 302-77-50
                                </p>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:otbozor.rasmiy@gmail.com"
                            className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Email</p>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    otbozor.rasmiy@gmail.com
                                </p>
                            </div>
                        </a>

                        {/* Response time badge */}
                        <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Tez javob</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-500">Odatda bir necha daqiqada</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Telegram CTA */}
                    <div className="lg:col-span-2">
                        <div className="relative h-full bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-8 md:p-10 shadow-xl shadow-sky-500/20 overflow-hidden flex flex-col items-center justify-center text-center">
                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
                            <div className="absolute -bottom-14 -left-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

                            {/* Telegram icon */}
                            <div className="relative w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                                <svg className="w-11 h-11 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
                                </svg>
                            </div>

                            <h2 className="relative text-2xl md:text-3xl font-bold text-white mb-3">
                                Telegram orqali bog'laning
                            </h2>
                            <p className="relative text-sky-100 mb-8 max-w-sm text-base">
                                Savollaringizga tezkor javob olish uchun <span className="font-semibold text-white">@doniyorjon_k</span> Telegram lichkasiga murojaat qiling.
                            </p>

                            <a
                                href="https://t.me/doniyorjon_k"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-sky-50 text-sky-600 rounded-2xl font-bold text-base transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
                                </svg>
                                Bog'lanish
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
