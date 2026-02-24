'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Check, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface Props {
    title: string;
    productId: string;
    ownerId: string | null;
    slug: string;
}

export function ProductDetailActions({ title, productId, ownerId, slug }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isOwner = !!user && !!ownerId && user.id === ownerId;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // user cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Mahsulotni o'chirishni xohlaysizmi?")) return;
        setDeleting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/my/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                router.push('/profil/mahsulotlarim');
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-between mb-4 gap-2">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Orqaga
            </button>

            <div className="flex items-center gap-2">
                {isOwner && (
                    <>
                        <button
                            onClick={() => router.push(`/mahsulot/${productId}/tahrir`)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            <Pencil className="w-4 h-4" />
                            Tahrirlash
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            O&apos;chirish
                        </button>
                    </>
                )}

                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-500" />
                            Nusxalandi
                        </>
                    ) : (
                        <>
                            <Share2 className="w-4 h-4" />
                            Ulashish
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
