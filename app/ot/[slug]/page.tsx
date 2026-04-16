import { getListing, getSimilarListings } from '@/lib/api';
import { formatPrice, formatDateTime, getPurposeLabel, getGenderLabel } from '@/lib/utils';
import { ListingGallery } from '@/components/listing/ListingGallery';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingInteractions } from '@/components/listing/ListingInteractions';
import { ListingDetailActions } from '@/components/listing/ListingDetailActions';
import { FavoriteButton } from '@/components/listing/FavoriteButton';
import { ViewTracker } from '@/components/listing/ViewTracker';
import { CommentSection } from '@/components/comments/CommentSection';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { MapPin, Shield, Calendar, Eye } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    try {
        let id = params.slug;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = params.slug.match(uuidRegex);
        if (match) id = match[0];

        const listing = await getListing(id);
        return {
            title: `${listing.title} - ${formatPrice(listing.priceAmount, listing.priceCurrency)} | Otbozor`,
            description: listing.description?.slice(0, 160) || `O'zbekistonda sotiladigan ${listing.breed?.name || 'ot'}. Narxi: ${formatPrice(listing.priceAmount, listing.priceCurrency)}`,
            openGraph: {
                images: listing.media?.[0]?.url ? [listing.media[0].url] : [],
            },
        };
    } catch {
        return { title: 'E\'lon topilmadi' };
    }
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
    let id = params.slug;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = params.slug.match(uuidRegex);
    if (match) id = match[0];

    let listing;
    let similarListings = [];
    let currentUserId: string | undefined;

    try {
        listing = await getListing(id).catch(() => null);
        if (!listing) notFound();
        similarListings = await getSimilarListings(id).catch(() => []);

        // Get current user from cookie
        const cookieStore = cookies();
        const accessToken = cookieStore.get('access_token')?.value;
        if (accessToken) {
            try {
                const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
                currentUserId = payload.userId;
            } catch { }
        }
    } catch {
        notFound();
    }

    const dateStr = listing.publishedAt || listing.createdAt;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* Track view from browser (deduplication works correctly) */}
            <ViewTracker listingId={listing.id} />

            {/* Top bar: Back ← | → Share */}
            <ListingDetailActions title={listing.title} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Left Column: Gallery & Info */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 order-1 lg:order-1">
                    <ListingGallery media={listing.media} title={listing.title} />

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">

                        {/* Title + Save */}
                        <div className="flex items-start justify-between gap-3 mb-1">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {listing.title}
                            </h1>
                            <div className="flex-shrink-0 mt-1">
                                <FavoriteButton listingId={listing.id} variant="outline" />
                            </div>
                        </div>

                        {/* Price — right after title */}
                        <div className="mb-4">
                            <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {formatPrice(listing.priceAmount, listing.priceCurrency)}
                            </p>
                            {listing.priceCurrency === 'USD' && (
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                                    Taxminan {formatPrice(listing.priceAmount * 12400)}
                                </p>
                            )}
                        </div>

                        {/* Meta: location, date+time, views */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {listing.region?.nameUz}{listing.district?.nameUz ? `, ${listing.district.nameUz}` : ''}
                            </span>
                            {dateStr && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateTime(dateStr)}
                                </span>
                            )}
                            {listing.viewCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {listing.viewCount} ko&apos;rildi
                                </span>
                            )}
                        </div>

                        <hr className="my-6 border-slate-100 dark:border-slate-700" />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Zoti</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.breed?.name || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Yoshi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.ageYears ? `${listing.ageYears} yosh` : '-'}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Jinsi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{getGenderLabel(listing.gender || '')}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Maqsad</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{getPurposeLabel(listing.purpose || '')}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Hujjat</span>
                                <span className={`font-medium ${listing.hasPassport ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {listing.hasPassport ? 'Bor' : 'Yo\'q'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm text-slate-500 dark:text-slate-400 mb-1">Rangi</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{listing.color || '-'}</span>
                            </div>
                        </div>

                        <hr className="my-6 border-slate-100 dark:border-slate-700" />

                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">Tavsif</h3>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {listing.description || 'Tavsif yo\'q'}
                            </p>
                        </div>
                    </div>

                    {/* Comments Section - Desktop (below listing info) */}
                    <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <CommentSection listingId={listing.id} currentUserId={currentUserId} />
                    </div>
                </div>

                {/* Right Column: Seller & Contact */}
                <div className="space-y-6 order-2 lg:order-2">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 lg:sticky lg:top-24">

                        {/* Seller Info */}
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="relative w-11 h-11 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-lg overflow-hidden text-slate-600 dark:text-slate-300 flex-shrink-0">
                                    {listing.user.avatarUrl ? (
                                        <Image src={listing.user.avatarUrl} alt={listing.contactName || listing.user.displayName} fill sizes="44px" className="object-cover" />
                                    ) : (
                                        (listing.contactName || listing.user.displayName)?.[0]?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{listing.contactName || listing.user.displayName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {listing.user.isVerified ? 'Tasdiqlangan sotuvchi' : 'Sotuvchi'}
                                    </p>
                                </div>
                                {listing.user.isVerified && (
                                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
                                )}
                            </div>
                        </div>

                        <ListingInteractions
                            telegramUsername={listing.contactTelegram || listing.user.telegramUsername || ''}
                            phone={listing.contactPhone || listing.user.phone}
                        />
                    </div>
                </div>
            </div>

            {/* Comments Section - Mobile only (below everything) */}
            <div className="lg:hidden mt-8">
                <CommentSection listingId={listing.id} currentUserId={currentUserId} />
            </div>

            {/* Similar Listings */}
            {similarListings.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">O&apos;xshash e&apos;lonlar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarListings.map(item => (
                            <ListingCard key={item.id} listing={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
