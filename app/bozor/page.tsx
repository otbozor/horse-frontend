import { Suspense } from 'react';
import { getListings, ListingsFilter } from '@/lib/api';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingFilters } from '@/components/listing/ListingFilters';
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar Filters */}
                <aside className="lg:w-1/4">
                    <Suspense fallback={
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-10 bg-slate-200 rounded"></div>
                                <div className="h-10 bg-slate-200 rounded"></div>
                                <div className="h-10 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    }>
                        <ListingFilters />
                    </Suspense>
                </aside>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Barcha e'lonlar <span className="text-slate-500 text-lg font-normal">({pagination.total})</span>
                        </h1>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select className="select py-2 pl-3 pr-8 text-sm w-full sm:w-48 bg-white">
                                <option value="newest">Yangi e'lonlar</option>
                                <option value="price_asc">Arzonroq</option>
                                <option value="price_desc">Qimmatroq</option>
                                <option value="views">Ko'p ko'rilgan</option>
                            </select>
                        </div>
                    </div>

                    {/* Listings Grid */}
                    {listings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">E'lonlar topilmadi</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
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
