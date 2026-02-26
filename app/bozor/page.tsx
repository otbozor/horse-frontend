import { Suspense } from 'react';
import { getListings, ListingsFilter } from '@/lib/api';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingFilters } from '@/components/listing/ListingFilters';
import { BozorMobileFilters } from '@/components/listing/BozorMobileFilters';
import { SortSelect } from '@/components/listing/SortSelect';
import { Search } from 'lucide-react';
import { Pagination } from '../../components/listing/Pagination';

export const metadata = {
    title: 'Ot bozori - Barcha e\'lonlar',
    description: 'O\'zbekiston bo\'ylab sotiladigan otlar ro\'yxati. Ko\'pkari, sport va sayr otlarini qulay narxlarda toping.',
};

export default async function BozorPage({
    searchParams,
}: {
    searchParams: ListingsFilter;
}) {
    const result = await getListings(searchParams).catch(() => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }));
    const listings = result.data || [];
    const pagination = result.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                {/* Left Sidebar Filters — desktop only */}
                <aside className="hidden lg:block w-1/4 flex-shrink-0">
                    <Suspense fallback={
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                                <div className="h-10 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                <div className="h-10 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                <div className="h-10 bg-slate-200 dark:bg-slate-600 rounded"></div>
                            </div>
                        </div>
                    }>
                        <ListingFilters />
                    </Suspense>
                </aside>

                {/* Main Content */}
                <div className="w-full lg:w-3/4 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                Barcha e&apos;lonlar <span className="text-slate-500 text-base sm:text-lg font-normal">({pagination.total})</span>
                            </h1>
                            {/* Mobile filter button */}
                            <BozorMobileFilters />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Suspense fallback={<div className="w-48 h-9 bg-slate-100 rounded-lg animate-pulse" />}>
                                <SortSelect />
                            </Suspense>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    {listings.length > 0 ? (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
                            <div className="bg-white dark:bg-slate-700 p-4 rounded-full inline-block shadow-sm mb-4">
                                <Search className="w-8 h-8 text-slate-400 dark:text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">E'lonlar topilmadi</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                Sizning so'rovingiz bo'yicha hech qanday natija yo'q. Filtrlarni o'zgartirib ko'ring.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            searchParams={searchParams}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
