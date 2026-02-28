import { Listing } from '@/lib/api';
import { ListingCard } from '@/components/listing/ListingCard';

interface FeaturedSliderProps {
    listings: Listing[];
}

export function FeaturedSlider({ listings }: FeaturedSliderProps) {
    const items = listings.slice(0, 20);

    if (items.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} priority={index < 2} />
            ))}
        </div>
    );
}
