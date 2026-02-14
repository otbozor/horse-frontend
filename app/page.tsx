import Link from 'next/link';
import { Shield, MessageCircle, Eye, Star, MapPin, ChevronRight, Trophy } from 'lucide-react';
import { getFeaturedListings, getAllPublicEvents } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSlider } from '@/components/home/FeaturedSlider';

export default async function HomePage() {
    // Fetch real data from API - more listings for slider
    const featuredListings = await getFeaturedListings(12).catch(() => []);
    const allEvents = await getAllPublicEvents().catch(() => []);
    const upcomingEvents = allEvents.slice(0, 3);
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Listings - Auto-scrolling slider */}
            {featuredListings.length > 0 && (
                <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    Premium e'lonlar
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">To'langan va ishonchli e'lonlar</p>
                            </div>
                            <Link
                                href="/bozor"
                                className="btn btn-outline hidden md:flex"
                            >
                                Barchasini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <FeaturedSlider listings={featuredListings} />

                        <div className="mt-8 text-center md:hidden">
                            <Link href="/bozor" className="btn btn-outline">
                                Barchasini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Upcoming Ko'pkari Events */}
            <section className="py-12 md:py-16 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Yaqinlashayotgan ko'pkarilar
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">O'zbekiston bo'ylab tadbirlar</p>
                        </div>
                        <Link
                            href="/kopkari"
                            className="btn btn-outline hidden md:flex"
                        >
                            Barchasini ko'rish
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/kopkari/${event.slug}`}
                                    className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 card-hover group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-amber-500 rounded-xl flex flex-col items-center justify-center text-white">
                                            <span className="text-xs font-medium">
                                                {new Date(event.startsAt).toLocaleDateString('uz-UZ', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-bold">
                                                {new Date(event.startsAt).getDate()}
                                            </span>
                                        </div>
                                        {event.prizePool && (
                                            <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                                {formatPrice(event.prizePool, 'UZS')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.region.nameUz}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-200 dark:border-amber-800">
                            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Tez orada ko'pkarilar boshlanadi
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                Yaqinlashayotgan musobaqalar haqida xabardor bo'ling
                            </p>
                            <Link href="/kopkari" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm transition-colors">
                                Ko'pkari taqvimini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {upcomingEvents.length > 0 && (
                        <div className="mt-8 text-center md:hidden">
                            <Link href="/kopkari" className="btn btn-outline">
                                Barchasini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Blocks */}
            <section className="py-12 md:py-16 bg-slate-900 text-white dark:bg-slate-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        Nima uchun Otbozor?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-primary-400" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Telegram verifikatsiya</h3>
                            <p className="text-slate-400">
                                Barcha sotuvchilar Telegram orqali tasdiqlanadi. Soxta akkauntlar yo'q.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-8 h-8 text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Moderatsiya</h3>
                            <p className="text-slate-400">
                                Har bir e'lon moderatorlar tomonidan tekshiriladi. Spam va g'irrom yo'q.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-sky-400" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Tez aloqa</h3>
                            <p className="text-slate-400">
                                Sotuvchiga 1 klik bilan Telegramda yozing. Telefon default yashirin.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-rose-400" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Shikoyat tizimi</h3>
                            <p className="text-slate-400">
                                G'irrom e'lon ko'rsangiz, shikoyat qiling. Tez javob kafolatlanadi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
