'use client';

import { useState } from 'react';
import { Heart, Share2, AlertTriangle, Check, Phone } from 'lucide-react';

interface Props {
    telegramUsername: string;
}

export function ListingInteractions({ telegramUsername }: Props) {
    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback: do nothing silently
        }
    };

    return (
        <>
            <div className="flex gap-3 mb-6">
                <a
                    href={`https://t.me/${telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1 py-3 text-base shadow-primary-500/20 shadow-lg justify-center"
                >
                    <Phone className="w-5 h-5" />
                    Telegramda bog&apos;lanish
                </a>
                <button
                    onClick={() => setLiked((v) => !v)}
                    title={liked ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}
                    className="btn btn-secondary px-4"
                >
                    <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
            </div>

            <div className="mt-4 flex justify-between text-sm text-slate-400 dark:text-slate-500">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Share2 className="w-4 h-4" />
                    )}
                    {copied ? 'Nusxalandi!' : 'Ulashish'}
                </button>
                <a
                    href="/aloqa"
                    className="flex items-center gap-1 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Shikoyat
                </a>
            </div>
        </>
    );
}
