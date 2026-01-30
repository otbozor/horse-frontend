import { getUpcomingEvents, KopkariEvent } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Ko'pkari taqvimi - Barcha tadbirlar | Otbozor",
    description: "O'zbekistondagi barcha ko'pkari va ot musobaqalari taqvimi. Sovrinlar, joylashuv va tashkilotchilar haqida ma'lumot.",
};

export default async function KopkariPage() {
    const events = await getUpcomingEvents(50);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Ko'pkari Taqvimi</h1>
                    <p className="text-slate-600">Yaqinlashib kelayotgan ot choptirish musobaqalari</p>
                </div>

                {/* Filter placeholders */}
                <div className="flex gap-2">
                    <select className="select py-2 pl-3 pr-8 text-sm">
                        <option value="">Barcha hududlar</option>
                        <option value="toshkent">Toshkent</option>
                        <option value="samarqand">Samarqand</option>
                    </select>
                    <select className="select py-2 pl-3 pr-8 text-sm">
                        <option value="upcoming">Kutilayotgan</option>
                        <option value="past">O'tgan</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                    <Link
                        key={event.id}
                        href={`/kopkari/${event.slug}`}
                        className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Date Badge */}
                            <div className="flex-shrink-0 w-20 h-20 bg-amber-50 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-amber-600">
                                <span className="text-xs font-semibold uppercase">{new Date(event.startsAt).toLocaleDateString('uz-UZ', { month: 'short' })}</span>
                                <span className="text-3xl font-bold leading-none">{new Date(event.startsAt).getDate()}</span>
                                <span className="text-xs">{new Date(event.startsAt).toLocaleDateString('uz-UZ', { weekday: 'short' })}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                                    {event.title}
                                </h3>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {event.region.nameUz}
                                        {event.district && `, ${event.district.nameUz}`}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {formatDate(event.startsAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Prize */}
                            {event.prizePool && (
                                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-sm">
                                    <Trophy className="w-5 h-5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold opacity-80">Jami sovrin</span>
                                        <span className="font-bold">{formatPrice(event.prizePool)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}

                {events.length === 0 && (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Hozircha kutilayotgan tadbirlar yo'q</p>
                    </div>
                )}
            </div>
        </div>
    );
}
