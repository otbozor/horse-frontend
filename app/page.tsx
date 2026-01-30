import Link from 'next/link';
import { Search, Plus, Shield, MessageCircle, Eye, Star, MapPin, ChevronRight } from 'lucide-react';
import { getFeaturedListings, getUpcomingEvents } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default async function HomePage() {
    // Fetch real data from API
    const featuredListings = await getFeaturedListings(4).catch(() => []);
    const upcomingEvents = await getUpcomingEvents(3).catch(() => []);
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 md:py-24 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Otingizni tez soting
                            <br />
                            yoki <span className="text-amber-300">toping</span>
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            O'zbekistondagi eng katta ot savdo platformasi. Minglab e'lonlar,
                            verifikatsiyalangan sotuvchilar, xavfsiz savdo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/elon/yaratish"
                                className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 shadow-xl"
                            >
                                <Plus className="w-5 h-5" />
                                E'lon joylash
                            </Link>
                            <Link
                                href="/bozor"
                                className="btn btn-lg border-2 border-white/30 text-white hover:bg-white/10"
                            >
                                <Search className="w-5 h-5" />
                                Ot qidirish
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Filter Section */}
            <section className="py-8 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
                        Tez qidiruv uchun <Link href="/bozor" className="text-primary-600 hover:text-primary-700 font-medium">Bozor sahifasiga</Link> o'ting
                    </p>
                </div>
            </section>

            {/* Featured Listings */}
            {featuredListings.length > 0 && (
                <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    Tanlangan e'lonlar
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">Eng mashhur va ishonchli e'lonlar</p>
                            </div>
                            <Link
                                href="/bozor"
                                className="btn btn-outline hidden md:flex"
                            >
                                Barchasini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredListings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/ot/${listing.slug}`}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 card-hover group"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                                        {listing.media[0] ? (
                                            <img
                                                src={listing.media[0].thumbUrl || listing.media[0].url}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <span className="text-6xl">🐴</span>
                                            </div>
                                        )}
                                        {listing.hasVideo && (
                                            <span className="absolute top-3 left-3 badge bg-black/60 text-white">
                                                📹 Video
                                            </span>
                                        )}
                                        {listing.user.isVerified && (
                                            <span className="absolute top-3 right-3 badge badge-success">
                                                ✓ Tasdiqlangan
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {listing.title}
                                        </h3>
                                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                            {formatPrice(listing.priceAmount, listing.priceCurrency)}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>{listing.region.nameUz}{listing.district && `, ${listing.district.nameUz}`}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                                            {listing.ageYears && <span className="badge badge-gray">{listing.ageYears} yosh</span>}
                                            {listing.breed && <span className="badge badge-gray">{listing.breed.name}</span>}
                                            {listing.hasPassport && (
                                                <span className="badge badge-info">Hujjat</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

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
            {upcomingEvents.length > 0 && (
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
                                                🏆 {formatPrice(event.prizePool, 'UZS')}
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

                        <div className="mt-8 text-center md:hidden">
                            <Link href="/kopkari" className="btn btn-outline">
                                Barchasini ko'rish
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

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

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Otingizni soting yoki yangi ot toping
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        3 daqiqada e'lon joylang va minglab xaridorlarga yeting
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/elon/yaratish"
                            className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Bepul e'lon joylash
                        </Link>
                        <Link
                            href="/bozor"
                            className="btn btn-lg border-2 border-white/30 text-white hover:bg-white/10"
                        >
                            Bozorga o'tish
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
