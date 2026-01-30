import Link from 'next/link';
import { MapPin, Video, CheckCircle } from 'lucide-react';
import { Listing } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    const mainImage = listing.media?.[0]?.thumbUrl || listing.media?.[0]?.url || '/images/placeholder-horse.jpg';

    return (
        <Link
            href={`/ot/${listing.id}-${listing.slug}`}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
        >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                    src={mainImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    {listing.hasVideo && (
                        <span className="badge bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Video
                        </span>
                    )}
                </div>

                {listing.user?.isVerified && (
                    <div className="absolute top-2 right-2">
                        <span className="badge badge-success backdrop-blur-sm shadow-sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Tasdiqlangan
                        </span>
                    </div>
                )}

                {/* Bottom gradient for text readability if needed, but here we have separation */}
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-slate-900 line-clamp-2 text-sm md:text-base group-hover:text-primary-700 transition-colors">
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
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                            {listing.ageYears} yosh
                        </span>
                    )}
                    {listing.breed && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                            {listing.breed.name}
                        </span>
                    )}
                    {listing.purpose && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                            {listing.purpose}
                        </span>
                    )}
                </div>

                <div className="flex items-center text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">
                        {listing.region.nameUz}
                        {listing.district ? `, ${listing.district.nameUz}` : ''}
                    </span>
                </div>
            </div>
        </Link>
    );
}
