'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition-colors"
        >
            <ArrowLeft className="w-4 h-4" />
            Orqaga
        </button>
    );
}
