import Link from 'next/link';
import { MapPin, Video, Clock, Crown } from 'lucide-react';
import { GiHorseHead } from 'react-icons/gi';
import { Listing } from '@/lib/api';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import { FavoriteButton } from './FavoriteButton';

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    const mainImage = listing.media?.[0]?.thumbUrl || listing.media?.[0]?.url || null;
    const dateStr = listing.publishedAt || listing.createdAt;

    return (
        <Link
            href={`/ot/${listing.id}-${listing.slug}`}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
        >
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><GiHorseHead className="w-20 h-20" /></div>
                )}

                {/* Top-left badges */}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    {listing.isPremium ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-sm">
                            <Crown className="w-3 h-3" />
                            Premium
                        </span>
                    ) : listing.isTop ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm">
                            <Crown className="w-3 h-3" />
                            Top
                        </span>
                    ) : null}
                    {listing.hasVideo && (
                        <span className="badge bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video
                        </span>
                    )}
                </div>

                {/* Top-right: save button */}
                <div className="absolute top-2 right-2">
                    <FavoriteButton listingId={listing.id} />
                </div>
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2 text-sm md:text-base group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                        {listing.title}
                    </h3>
                </div>

                <div className="mb-2">
                    <p className="text-lg font-bold text-primary-600">
                        {formatPrice(listing.priceAmount, listing.priceCurrency)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500 my-2">
                    {listing.ageYears && (
                        <span className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            {listing.ageYears} yosh
                        </span>
                    )}
                    {listing.breed && (
                        <span className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            {listing.breed.name}
                        </span>
                    )}
                    {listing.purpose && (
                        <span className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                            {listing.purpose}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                            {listing.region.nameUz}
                            {listing.district ? `, ${listing.district.nameUz}` : ''}
                        </span>
                    </span>
                    {dateStr && (
                        <span className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(dateStr)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
