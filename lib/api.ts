const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { params, ...init } = options;

    let url = `${API_BASE}${endpoint}`;

    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const response = await fetch(url, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...init.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// Listings
export interface Listing {
    id: string;
    title: string;
    slug: string;
    description?: string;
    priceAmount: number;
    priceCurrency: 'UZS' | 'USD';
    ageYears?: number;
    gender?: string;
    purpose?: string;
    color?: string;
    hasPassport: boolean;
    hasVaccine?: boolean;
    hasVideo: boolean;
    viewCount: number;
    favoriteCount: number;
    status: string;
    publishedAt?: string;
    region: { nameUz: string; slug: string };
    district?: { nameUz: string; slug: string };
    breed?: { name: string; slug: string };
    user: {
        id: string;
        displayName: string;
        telegramUsername?: string;
        isVerified: boolean;
        avatarUrl?: string;
    };
    media: Array<{
        id: string;
        url: string;
        thumbUrl?: string;
        type: 'IMAGE' | 'VIDEO';
    }>;
}

export interface ListingsResponse {
    data: Listing[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ListingsFilter {
    regionId?: string;
    districtId?: string;
    breedId?: string;
    purpose?: string;
    gender?: string;
    priceMin?: number;
    priceMax?: number;
    ageMin?: number;
    ageMax?: number;
    hasPassport?: boolean;
    hasVaccine?: boolean;
    hasVideo?: boolean;
    q?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export async function getListings(filter: ListingsFilter = {}): Promise<ListingsResponse> {
    return apiFetch('/api/listings', { params: filter as any });
}

export async function getListing(id: string): Promise<Listing> {
    return apiFetch(`/api/listings/${id}`);
}

export async function getFeaturedListings(limit = 12): Promise<Listing[]> {
    return apiFetch('/api/listings/featured', { params: { limit } });
}

export async function getSimilarListings(id: string): Promise<Listing[]> {
    return apiFetch(`/api/listings/${id}/similar`);
}

// Regions
export interface Region {
    id: string;
    nameUz: string;
    nameRu?: string;
    slug: string;
    districts?: District[];
}

export interface District {
    id: string;
    nameUz: string;
    nameRu?: string;
    slug: string;
}

export async function getRegions(): Promise<Region[]> {
    return apiFetch('/api/regions');
}

export async function getRegionsWithDistricts(): Promise<Region[]> {
    return apiFetch('/api/regions/with-districts');
}

// Breeds
export interface Breed {
    id: string;
    name: string;
    slug: string;
}

export async function getBreeds(): Promise<Breed[]> {
    return apiFetch('/api/breeds');
}

// Events
export interface KopkariEvent {
    id: string;
    title: string;
    slug: string;
    description?: string;
    startsAt: string;
    endsAt?: string;
    region: { nameUz: string; slug: string };
    district?: { nameUz: string; slug: string };
    addressText?: string;
    mapUrl?: string;
    organizerName: string;
    contactTelegram?: string;
    prizePool?: number;
    rules?: string;
}

export async function getUpcomingEvents(limit = 6): Promise<KopkariEvent[]> {
    return apiFetch('/api/events/upcoming', { params: { limit } });
}

export async function getEvent(slug: string): Promise<KopkariEvent> {
    return apiFetch(`/api/events/${slug}`);
}

// User listings
export async function createListingDraft(data: any): Promise<Listing> {
    return apiFetch('/api/my/listings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateListingDraft(id: string, data: any): Promise<Listing> {
    return apiFetch(`/api/my/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function submitListingForReview(id: string): Promise<Listing> {
    return apiFetch(`/api/my/listings/${id}/submit`, {
        method: 'POST',
    });
}

// Media
export async function getSignedUploadUrl(
    entityType: string,
    contentType: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    return apiFetch('/api/media/signed-url', {
        method: 'POST',
        body: JSON.stringify({ entityType, contentType }),
    });
}

export async function attachMediaToListing(
    listingId: string,
    media: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number }>
): Promise<void> {
    await apiFetch('/api/media/attach', {
        method: 'POST',
        body: JSON.stringify({ listingId, media }),
    });
}

// Favorites
export async function addToFavorites(listingId: string): Promise<void> {
    await apiFetch(`/api/listings/${listingId}/favorite`, { method: 'POST' });
}

export async function removeFromFavorites(listingId: string): Promise<void> {
    await apiFetch(`/api/listings/${listingId}/favorite`, { method: 'DELETE' });
}

// Auth
export async function getCurrentUser() {
    return apiFetch('/api/auth/me');
}

export async function logout(): Promise<void> {
    await apiFetch('/api/auth/logout', { method: 'POST' });
}
