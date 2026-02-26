import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-[88vh] flex items-center bg-white dark:bg-slate-950 overflow-hidden">
            {/* Glow effects */}
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-1/3 bottom-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 top-1/2 w-64 h-64 bg-emerald-300/8 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white leading-tight mb-6">
                            Orzuingizdagi{' '}
                            <span className="text-primary-600 dark:text-primary-400">otni toping</span>{' '}
                            yoki tez soting
                        </h1>

                        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                            O'zbekistondagi eng ishonchli ot savdo platformasi.
                            Verifikatsiyalangan sotuvchilar, xavfsiz savdo, premium e'lonlar.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-10">
                            <Link
                                href="/bozor"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-base transition-colors shadow-lg shadow-primary-500/20"
                            >
                                <Search className="w-5 h-5" />
                                Ot qidirish
                            </Link>
                            <Link
                                href="/elon/yaratish"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold text-base transition-colors"
                            >
                                E'lon joylash
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                Tekshirilgan otlar
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                Xavfsiz to'lov
                            </div>
                        </div>
                    </div>

                    {/* Right - Horse image */}
                    <div className="hidden lg:flex justify-center">
                        <div className="relative w-full max-w-lg">
                            {/* Decorative ring matching forest-green tones */}
                            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-100 to-primary-100 dark:from-emerald-900/30 dark:to-primary-900/30 blur-sm" />
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-emerald-200/60 dark:ring-emerald-700/40">
                                <Image
                                    src="/group.png"
                                    alt="Ot"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
