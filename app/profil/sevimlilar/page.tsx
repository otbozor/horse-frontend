'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MapPin, Eye } from 'lucide-react';

interface Listing {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    viewCount: number;
    region: { nameUz: string };
    breed?: { name: string };
    ageYears?: number;
    media: Array<{ url: string; thumbUrl?: string }>;
}

export default function FavoritesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchFavorites();
        }
    }, [user, isLoading]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/listings/favorites`,
                { credentials: 'include' }
            );
            const data = await res.json();
            setFavorites(data || []);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (listingId: string) => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${listingId}/favorite`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            setFavorites(favorites.filter(f => f.id !== listingId));
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Sevimlilar</h1>
                    <p className="text-slate-600 mt-1">Saqlab qo'ygan e'lonlaringiz ({favorites.length})</p>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group"
                            >
                                <Link href={`/ot/${listing.slug}`} className="block">
                                    <div className="relative aspect-video bg-slate-100">
                                        {listing.media[0] ? (
                                            <img
                                                src={listing.media[0].thumbUrl || listing.media[0].url}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                                🐴
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {listing.title}
                                        </h3>
                                        <p className="text-xl font-bold text-primary-600 mb-2">
                                            {listing.priceAmount.toLocaleString()} {listing.priceCurrency}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{listing.region.nameUz}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            {listing.ageYears && (
                                                <span className="badge badge-gray">{listing.ageYears} yosh</span>
                                            )}
                                            {listing.breed && (
                                                <span className="badge badge-gray">{listing.breed.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                <div className="px-4 pb-4">
                                    <button
                                        onClick={() => handleRemoveFavorite(listing.id)}
                                        className="w-full btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Heart className="w-4 h-4 fill-current" />
                                        Sevimlilardan o'chirish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                        <div className="text-6xl mb-4">❤️</div>
                        <h3 className="text-xl font-medium text-slate-900 mb-2">
                            Sevimlilar ro'yxati bo'sh
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Yoqqan e'lonlarni sevimlilar ro'yxatiga qo'shing
                        </p>
                        <Link href="/bozor" className="btn btn-primary">
                            E'lonlarni ko'rish
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
