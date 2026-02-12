'use client';

import { useState, useEffect } from 'react';
import { Heart, Share2, AlertTriangle, Check, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { addToFavorites, removeFromFavorites, isFavorite } from '@/lib/api';

interface Props {
    listingId: string;
    telegramUsername: string;
    phone?: string;
}

export function ListingInteractions({ listingId, telegramUsername, phone }: Props) {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [phoneCopied, setPhoneCopied] = useState(false);

    const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Sahifa yuklanganda sevimlilar holatini tekshirish
    useEffect(() => {
        if (!isAuthenticated) return;
        isFavorite(listingId).then(setLiked).catch(() => {});
    }, [isAuthenticated, listingId]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            if (liked) {
                await removeFromFavorites(listingId);
                setLiked(false);
            } else {
                await addToFavorites(listingId);
                setLiked(true);
            }
        } catch {
            // Xatolikda holatni qaytarish
        } finally {
            setLikeLoading(false);
        }
    };

    const handlePhoneClick = async (e: React.MouseEvent) => {
        if (isMobile()) return;
        e.preventDefault();
        if (!phone) return;
        try {
            await navigator.clipboard.writeText(phone);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = phone;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2000);
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && navigator.share) {
            try {
                await navigator.share({ title: document.title, url });
                return;
            } catch {}
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            {/* Contact Buttons */}
            <div className="space-y-3 mb-6">
                <a
                    href={`https://t.me/${telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white rounded-xl font-semibold text-base transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    Telegramdan bog&apos;lanish
                </a>

                {phone && (
                    <a
                        href={`tel:${phone}`}
                        onClick={handlePhoneClick}
                        className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-base transition-colors"
                    >
                        {phoneCopied ? (
                            <><Check className="w-5 h-5" /> Raqam nusxalandi!</>
                        ) : (
                            <><Phone className="w-5 h-5" /> Telefon qilish</>
                        )}
                    </a>
                )}
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        title={liked ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        <span className={liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}>
                            {liked ? 'Saqlangan' : 'Saqlash'}
                        </span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Share2 className="w-4 h-4" />
                        )}
                        {copied ? 'Nusxalandi!' : 'Ulashish'}
                    </button>
                </div>

                <a
                    href="/aloqa"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Shikoyat
                </a>
            </div>
        </>
    );
}
