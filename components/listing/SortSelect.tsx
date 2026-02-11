'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', e.target.value);
        }
        router.push(`/bozor?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={handleChange}
            className="select py-2 pl-3 pr-8 text-sm w-full sm:w-48"
        >
            <option value="newest">Yangi e'lonlar</option>
            <option value="price_asc">Arzonroq</option>
            <option value="price_desc">Qimmatroq</option>
            <option value="views">Ko'p ko'rilgan</option>
        </select>
    );
}
