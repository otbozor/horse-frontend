'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRegions, getBreeds, Region, Breed } from '@/lib/api';
import { CustomSelect } from '@/components/ui/CustomSelect';

export function ListingFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [regions, setRegions] = useState<Region[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize state from URL params
    const [filters, setFilters] = useState({
        regionId: searchParams.get('regionId') || '',
        districtId: searchParams.get('districtId') || '',
        breedId: searchParams.get('breedId') || '',
        purpose: searchParams.get('purpose') || '',
        gender: searchParams.get('gender') || '',
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [regionsData, breedsData] = await Promise.all([
                    getRegions(),
                    getBreeds(),
                ]);
                setRegions(regionsData);
                setBreeds(breedsData);
            } catch (error) {
                console.error('Failed to load filter data', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const handleChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        router.push(`/bozor?${params.toString()}`);
    };

    const clearFilters = () => {
        setFilters({
            regionId: '',
            districtId: '',
            breedId: '',
            purpose: '',
            gender: '',
            priceMin: '',
            priceMax: '',
        });
        router.push('/bozor');
    };

    if (isLoading) return <div className="p-4"><div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-700 rounded-xl"></div></div>;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Filtrlar</h3>
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Tozalash
                </button>
            </div>

            {/* Region */}
            <div>
                <label className="label">Viloyat</label>
                <CustomSelect
                    name="regionId"
                    value={filters.regionId}
                    onChange={handleChange}
                    placeholder="Barchasi"
                    options={[
                        { value: '', label: 'Barchasi' },
                        ...regions.map(r => ({ value: r.id, label: r.nameUz }))
                    ]}
                />
            </div>

            {/* Purpose */}
            <div>
                <label className="label">Maqsad</label>
                <CustomSelect
                    name="purpose"
                    value={filters.purpose}
                    onChange={handleChange}
                    placeholder="Barchasi"
                    options={[
                        { value: '', label: 'Barchasi' },
                        { value: 'KOPKARI', label: "Ko'pkari" },
                        { value: 'SPORT', label: 'Sport' },
                        { value: 'SAYR', label: 'Sayr' },
                        { value: 'ISHCHI', label: 'Ishchi' },
                        { value: 'NASLCHILIK', label: 'Naslchilik' },
                    ]}
                />
            </div>

            {/* Breed */}
            <div>
                <label className="label">Zoti</label>
                <CustomSelect
                    name="breedId"
                    value={filters.breedId}
                    onChange={handleChange}
                    placeholder="Barchasi"
                    options={[
                        { value: '', label: 'Barchasi' },
                        ...breeds.map(b => ({ value: b.id, label: b.name }))
                    ]}
                />
            </div>

            {/* Price */}
            <div>
                <label className="label">Narx (so'm)</label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        name="priceMin"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={handleChange}
                        className="input text-sm"
                        min="0"
                        step="1000"
                    />
                    <input
                        type="number"
                        name="priceMax"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={handleChange}
                        className="input text-sm"
                        min="0"
                        step="1000"
                    />
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="label">Jinsi</label>
                <div className="flex gap-2">
                    {['AYGIR', 'BIYA', 'AXTA'].map((g) => (
                        <label key={g} className={`
                flex-1 text-center py-2 px-1 rounded-lg border text-sm cursor-pointer transition-colors
                ${filters.gender === g
                                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400 font-medium'
                                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}
             `}>
                            <input
                                type="radio"
                                name="gender"
                                value={g}
                                checked={filters.gender === g}
                                onChange={handleChange}
                                className="hidden"
                            />
                            {g === 'AYGIR' ? 'Aygir' : g === 'BIYA' ? 'Biya' : 'Axta'}
                        </label>
                    ))}
                </div>
            </div>

            <button onClick={applyFilters} className="btn btn-primary w-full">
                Filtrlash
            </button>
        </div>
    );
}
