'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Video, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { HorseHeadIcon } from '@/components/icons/HorseIcons';
import { formatPrice } from '@/lib/utils';
import { Listing, addToFavorites, removeFromFavorites } from '@/lib/api';

interface FeaturedSliderProps {
    listings: Listing[];
}

export function FeaturedSlider({ listings }: FeaturedSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load user's existing favorites on mount
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/my/listings/favorites`, {
            credentials: 'include',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                const list: { id: string }[] = Array.isArray(data) ? data : (data?.data ?? []);
                if (list.length) setFavorites(new Set(list.map(l => l.id)));
            })
            .catch(() => {});
    }, []);

    const handleFavorite = async (e: React.MouseEvent, listingId: string) => {
        e.preventDefault();
        e.stopPropagation();
        const isFav = favorites.has(listingId);
        setFavorites(prev => {
            const next = new Set(prev);
            isFav ? next.delete(listingId) : next.add(listingId);
            return next;
        });
        try {
            if (isFav) {
                await removeFromFavorites(listingId);
            } else {
                await addToFavorites(listingId);
            }
        } catch {
            // Revert on error
            setFavorites(prev => {
                const next = new Set(prev);
                isFav ? next.add(listingId) : next.delete(listingId);
                return next;
            });
        }
    };

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    const scrollBy = useCallback((direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('a')?.offsetWidth || 300;
        const scrollAmount = direction === 'left' ? -cardWidth - 24 : cardWidth + 24;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (listings.length <= 1) return;

        const startAutoScroll = () => {
            intervalRef.current = setInterval(() => {
                const el = scrollRef.current;
                if (!el || isHovered) return;

                // If at end, scroll back to start
                if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
                    el.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const cardWidth = el.querySelector('a')?.offsetWidth || 300;
                    el.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
                }
            }, 4000);
        };

        startAutoScroll();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [listings.length, isHovered]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    if (listings.length === 0) return null;

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Navigation arrows */}
            {canScrollLeft && (
                <button
                    onClick={() => scrollBy('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2"
                    aria-label="Oldingi"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            {canScrollRight && (
                <button
                    onClick={() => scrollBy('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
                    aria-label="Keyingi"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {listings.map((listing) => (
                    <Link
                        key={listing.id}
                        href={`/ot/${listing.slug}`}
                        className="flex-shrink-0 w-[280px] sm:w-[300px] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {listing.media?.[0] ? (
                                <img
                                    src={listing.media[0].thumbUrl || listing.media[0].url}
                                    alt={listing.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <HorseHeadIcon className="w-20 h-20" />
                                </div>
                            )}
                            {listing.hasVideo && (
                                <span className="absolute top-3 left-3 badge bg-black/60 text-white flex items-center gap-1 text-xs px-2 py-1 rounded-md">
                                    <Video className="w-3 h-3" /> Video
                                </span>
                            )}
                            <button
                                onClick={(e) => handleFavorite(e, listing.id)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${favorites.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                            </button>
                            {/* Premium badge */}
                            <div className="absolute top-3 left-3">
                                <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                                    Premium
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                                {listing.title}
                            </h3>
                            <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                {formatPrice(listing.priceAmount, listing.priceCurrency)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">
                                    {listing.region?.nameUz}{listing.district ? `, ${listing.district.nameUz}` : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs">
                                {listing.ageYears && <span className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">{listing.ageYears} yosh</span>}
                                {listing.breed && <span className="bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">{listing.breed.name}</span>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
                {listings.map((_, idx) => (
                    <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"
                    />
                ))}
            </div>
        </div>
    );
}
