'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { GiHorseHead } from 'react-icons/gi';
import { Heart, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

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

const ITEMS_PER_PAGE = 12;

function FavoritesPageContent() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
    const paginatedFavorites = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return favorites.slice(start, start + ITEMS_PER_PAGE);
    }, [favorites, currentPage]);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/listings/favorites`,
                {
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const data = await res.json();
            const favorites = Array.isArray(data) ? data : (data?.data ?? []);
            setFavorites(favorites);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (listingId: string) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/${listingId}/favorite`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const updated = favorites.filter(f => f.id !== listingId);
            setFavorites(updated);
            const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    if (loading) {
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
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedFavorites.map((listing) => (
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
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <GiHorseHead className="w-16 h-16" />
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-600">
                                Sahifa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                            p === currentPage
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    </>
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


export default function FavoritesPage() {
    return (
        <RequireAuth redirectTo="/profil/sevimlilar">
            <FavoritesPageContent />
        </RequireAuth>
    );
}
