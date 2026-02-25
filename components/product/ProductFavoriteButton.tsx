'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface Props {
    productId: string;
    favoriteCount?: number;
    variant?: 'card' | 'detail';
}

export function ProductFavoriteButton({ productId, favoriteCount = 0, variant = 'detail' }: Props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [favorited, setFavorited] = useState(false);
    const [count, setCount] = useState(favoriteCount);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!isAuthenticated) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        fetch(`${API_URL}/api/products/${productId}/favorite`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => setFavorited(!!data.favorited))
            .catch(() => {});
    }, [isAuthenticated, productId, API_URL]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token || loading) return;

        setLoading(true);
        const prev = favorited;
        setFavorited(!prev);
        setCount(c => !prev ? c + 1 : Math.max(0, c - 1));
        try {
            const res = await fetch(`${API_URL}/api/products/${productId}/favorite`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                setFavorited(prev);
                setCount(c => prev ? c + 1 : Math.max(0, c - 1));
            }
        } catch {
            setFavorited(prev);
            setCount(c => prev ? c + 1 : Math.max(0, c - 1));
        } finally {
            setLoading(false);
        }
    };

    // Card variant: round button overlaid on image (like FavoriteButton for listings)
    if (variant === 'card') {
        return (
            <button
                onClick={handleToggle}
                aria-label="Saqlash"
                disabled={loading}
                className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm shadow transition-colors disabled:opacity-70 ${
                    favorited
                        ? 'bg-red-500 text-white'
                        : 'bg-black/40 text-white hover:bg-black/60'
                }`}
            >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
        );
    }

    // Detail variant: full button with text
    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${favorited
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400'
            } disabled:opacity-60`}
            title={favorited ? "Sevimlidan olib tashlash" : "Sevimlilarga qo'shish"}
        >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            <span>{favorited ? "Saqlangan" : "Saqlash"}</span>
            {count > 0 && <span className="text-xs opacity-70">({count})</span>}
        </button>
    );
}
