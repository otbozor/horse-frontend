'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CustomSelect } from '@/components/ui/CustomSelect';

export function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleChange = (e: { target: { name: string; value: string } }) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', e.target.value);
        }
        router.push(`/bozor?${params.toString()}`);
    };

    return (
        <CustomSelect
            name="sort"
            value={currentSort}
            onChange={handleChange}
            className="w-full sm:w-48"
            options={[
                { value: 'newest', label: "Yangi e'lonlar" },
                { value: 'price_asc', label: 'Arzonroq' },
                { value: 'price_desc', label: 'Qimmatroq' },
                { value: 'views', label: "Ko'p ko'rilgan" },
            ]}
        />
    );
}
