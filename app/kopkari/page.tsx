import { getAllPublicEvents } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';
import { MapPin, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { GiHorseshoe } from 'react-icons/gi';
import Link from 'next/link';

export const revalidate = 0; // Always fetch fresh data

export const metadata = {
    title: "Ko'pkari taqvimi - Barcha tadbirlar | Otbozor",
    description: "O'zbekistondagi barcha ko'pkari va ot musobaqalari taqvimi. Sovrinlar, joylashuv va tashkilotchilar haqida ma'lumot.",
};

export default async function KopkariPage() {
    const events = await getAllPublicEvents().catch(() => []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Ko'pkari Taqvimi</h1>
                    <p className="text-amber-100 text-lg">Yaqinlashib kelayotgan ot choptirish musobaqalari</p>
                    <p className="text-amber-200 text-sm mt-1">{events.length} ta tadbir rejalashtirilgan</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {events.map((event) => {
                            const date = new Date(event.startsAt);
                            return (
                                <Link
                                    key={event.id}
                                    href={`/kopkari/${event.slug}`}
                                    className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-700 transition-all flex gap-4 items-center"
                                >
                                    {/* Date Badge */}
                                    <div className="flex-shrink-0 w-16 h-16 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex flex-col items-center justify-center text-amber-600 dark:text-amber-400">
                                        <span className="text-[10px] font-bold uppercase leading-none">
                                            {date.toLocaleDateString('uz-UZ', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-bold leading-tight">{date.getDate()}</span>
                                        <span className="text-[10px] leading-none">
                                            {date.toLocaleDateString('uz-UZ', { weekday: 'short' })}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1 line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {event.region.nameUz}{event.district && `, ${event.district.nameUz}`}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(event.startsAt)}
                                            </span>
                                        </div>
                                        {event.prizePool && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
                                                <Trophy className="w-3 h-3" />
                                                {formatPrice(event.prizePool)}
                                            </span>
                                        )}
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 flex-shrink-0 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <div className="mb-4 flex justify-center"><GiHorseshoe className="w-16 h-16 text-slate-300 dark:text-slate-600" /></div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Hozircha tadbirlar yo'q</h3>
                        <p className="text-slate-500 dark:text-slate-400">Kutilayotgan ko'pkari musobaqalari tez orada qo'shiladi</p>
                    </div>
                )}
            </div>
        </div>
    );
}
