'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { GiHorseHead } from 'react-icons/gi';
import { Plus, Edit, Eye } from 'lucide-react';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface Listing {
    id: string;
    title: string;
    slug: string;
    priceAmount: number;
    priceCurrency: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
    viewCount: number;
    createdAt: string;
    region: { nameUz: string };
    media: Array<{ url: string; thumbUrl?: string }>;
}

function MyListingsPageContent() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchListings();
        }
    }, [user]);

    const fetchListings = async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/listings`,
                {
                    credentials: 'include',
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const data = await res.json();
            const listings = Array.isArray(data) ? data : (data?.data ?? []);
            setListings(listings);
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            DRAFT: 'bg-gray-100 text-gray-700',
            PENDING: 'bg-yellow-100 text-yellow-700',
            APPROVED: 'bg-green-100 text-green-700',
            REJECTED: 'bg-red-100 text-red-700',
            ARCHIVED: 'bg-slate-100 text-slate-700',
        };
        const labels = {
            DRAFT: 'Qoralama',
            PENDING: 'Tekshiruvda',
            APPROVED: 'Tasdiqlangan',
            REJECTED: 'Rad etilgan',
            ARCHIVED: 'Arxivlangan',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mening e'lonlarim</h1>
                        <p className="text-slate-600 mt-1">Barcha e'lonlaringizni boshqaring</p>
                    </div>
                    <Link href="/elon/yaratish" className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        Yangi e'lon
                    </Link>
                </div>

                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all"
                            >
                                <div className="relative aspect-video bg-slate-100">
                                    {listing.media[0] ? (
                                        <img
                                            src={listing.media[0].thumbUrl || listing.media[0].url}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <GiHorseHead className="w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {getStatusBadge(listing.status)}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                                        {listing.title}
                                    </h3>
                                    <p className="text-xl font-bold text-primary-600 mb-2">
                                        {listing.priceAmount.toLocaleString()} {listing.priceCurrency}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <Eye className="w-4 h-4" />
                                        <span>{listing.viewCount} ko'rishlar</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/elon/${listing.id}/edit`}
                                            className="flex-1 btn btn-outline btn-sm"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Tahrirlash
                                        </Link>
                                        {listing.status === 'APPROVED' && (
                                            <Link
                                                href={`/ot/${listing.slug}`}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                Ko'rish
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-medium text-slate-900 mb-2">
                            Hozircha e'lonlaringiz yo'q
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Birinchi e'loningizni yarating va sotishni boshlang
                        </p>
                        <Link href="/elon/yaratish" className="btn btn-primary">
                            <Plus className="w-5 h-5" />
                            E'lon yaratish
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MyListingsPage() {
    return (
        <RequireAuth redirectTo="/profil/elonlarim">
            <MyListingsPageContent />
        </RequireAuth>
    );
}
