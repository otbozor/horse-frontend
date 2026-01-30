import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';
import { MapPin, Calendar, Trophy, User, Phone, Share2, Navigation } from 'lucide-react';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    let event;

    try {
        event = await getEvent(params.slug);
    } catch (error) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                {/* Header */}
                <div className="relative h-48 md:h-64 bg-slate-900 flex items-end">
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200"
                            className="w-full h-full object-cover"
                            alt={event.title}
                        />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                    <div className="relative z-10 p-6 md:p-8 w-full">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 text-white/90">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-5 h-5 text-amber-400" />
                                {formatDate(event.startsAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-5 h-5 text-amber-400" />
                                {event.region.nameUz}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Tadbir haqida</h2>
                            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {event.rules && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Qoidalar</h2>
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900">
                                    {event.rules}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">Xarita</h2>
                            {event.mapUrl ? (
                                <>
                                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        <iframe
                                            src={event.mapUrl}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2 flex items-start gap-2">
                                        <Navigation className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        {event.addressText || `${event.region.nameUz}, ${event.district?.nameUz}`}
                                    </p>
                                </>
                            ) : (
                                <div className="aspect-video rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <p className="text-slate-500">Xarita mavjud emas</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {event.prizePool && (
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg shadow-amber-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Trophy className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-medium text-white/90">Umumiy sovrin jamg'armasi</span>
                                </div>
                                <p className="text-3xl font-bold">{formatPrice(event.prizePool)}</p>
                            </div>
                        )}

                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4">Tashkilotchi</h3>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{event.organizerName}</p>
                                    <p className="text-xs text-slate-500">Rasmiy tashkilotchi</p>
                                </div>
                            </div>

                            {event.contactTelegram && (
                                <a
                                    href={`https://t.me/${event.contactTelegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full justify-center mb-3"
                                >
                                    <Phone className="w-4 h-4" />
                                    Bog'lanish
                                </a>
                            )}

                            <button className="btn btn-outline w-full justify-center bg-white">
                                <Share2 className="w-4 h-4" />
                                Ulashish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
