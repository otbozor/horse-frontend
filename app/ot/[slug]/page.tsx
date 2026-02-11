import { getListing, getSimilarListings } from '@/lib/api';
import { formatPrice, formatDate, getPurposeLabel, getGenderLabel } from '@/lib/utils';
import { ListingGallery } from '@/components/listing/ListingGallery';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingInteractions } from '@/components/listing/ListingInteractions';
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

    try {
        listing = await getListing(id).catch(() => null);
        if (!listing) notFound();
        similarListings = await getSimilarListings(id).catch(() => []);
    } catch {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Gallery & Description */}
                <div className="lg:col-span-2 space-y-8">
                    <ListingGallery media={listing.media} title={listing.title} />

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {listing.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {listing.region.nameUz}{listing.district?.nameUz ? `, ${listing.district.nameUz}` : ''}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(listing.publishedAt || '')}
                            </span>
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
                </div>

                {/* Right Column: Price & Seller */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24">
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                            {formatPrice(listing.priceAmount, listing.priceCurrency)}
                        </div>
                        {listing.priceCurrency === 'USD' && (
                            <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                                Taxminan {formatPrice(listing.priceAmount * 12400)}
                            </p>
                        )}

                        <ListingInteractions telegramUsername={listing.user.telegramUsername || ''} />

                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600 mt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-xl overflow-hidden text-slate-600 dark:text-slate-300">
                                    {listing.user.avatarUrl ? (
                                        <img src={listing.user.avatarUrl} alt={listing.user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        listing.user.displayName?.[0]?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{listing.user.displayName}</p>
                                    {listing.publishedAt && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Otbozor&apos;da {new Date(listing.publishedAt).getFullYear()} yildan
                                        </p>
                                    )}
                                </div>
                            </div>

                            {listing.user.isVerified && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800/50 mb-3">
                                    <Shield className="w-4 h-4" />
                                    <span>Verifikatsiyalangan sotuvchi</span>
                                </div>
                            )}

                            <a
                                href={`https://t.me/${listing.user.telegramUsername || ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline w-full justify-center text-sm"
                            >
                                Telegramda yozish
                            </a>
                        </div>
                    </div>
                </div>
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
