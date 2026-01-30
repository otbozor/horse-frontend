import { Suspense } from 'react';
import { getListings, ListingsFilter } from '@/lib/api';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingFilters } from '@/components/listing/ListingFilters';
import { Search } from 'lucide-react';

export const metadata = {
    title: 'Ot bozori - Barcha e\'lonlar',
    description: 'O\'zbekiston bo\'ylab sotiladigan otlar ro\'yxati. Ko\'pkari, sport va sayr otlarini qulay narxlarda toping.',
};

export default async function BozorPage({
    searchParams,
}: {
    searchParams: ListingsFilter;
}) {
    const { data: listings, pagination } = await getListings(searchParams);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar Filters */}
                <aside className="lg:w-1/4">
                    <ListingFilters />
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

                    {/* Pagination (Simple version for MVP) */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${pagination.page === i + 1
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
