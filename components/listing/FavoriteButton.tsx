'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { addToFavorites, removeFromFavorites, isFavorite } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Props {
    listingId: string;
    variant?: 'card' | 'outline';
}

export function FavoriteButton({ listingId, variant = 'card' }: Props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        isFavorite(listingId)
            .then(setSaved)
            .catch(() => {});
    }, [listingId, isAuthenticated]);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (loading) return;
        setLoading(true);
        const prev = saved;
        setSaved(!prev);
        try {
            if (prev) {
                await removeFromFavorites(listingId);
            } else {
                await addToFavorites(listingId);
            }
        } catch {
            setSaved(prev);
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'outline') {
        return (
            <button
                onClick={handleClick}
                aria-label="Saqlash"
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-70 ${
                    saved
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-500 dark:text-red-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-500 dark:hover:text-red-400'
                }`}
            >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saqlangan' : 'Saqlash'}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            aria-label="Saqlash"
            disabled={loading}
            className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm shadow transition-colors disabled:opacity-70 ${
                saved
                    ? 'bg-red-500 text-white'
                    : 'bg-black/40 text-white hover:bg-black/60'
            }`}
        >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>
    );
}
