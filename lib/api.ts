const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
        // 401 Unauthorized - user not logged in, return empty response
        if (response.status === 401) {
            return { success: false, message: 'Unauthorized' } as T;
        }

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
    const response = await apiFetch<AuthResponse<ListingsResponse>>('/api/listings', { params: filter as any });
    if (response.success && response.data) {
        return response.data;
    }
    return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
}

export async function getListing(idOrSlug: string): Promise<Listing> {
    // Try to fetch by ID or slug
    const response = await apiFetch<AuthResponse<Listing>>(`/api/listings/${idOrSlug}`);
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error('Listing not found');
}

export async function getFeaturedListings(limit = 12): Promise<Listing[]> {
    const response = await apiFetch<AuthResponse<Listing[]>>('/api/listings/featured', { params: { limit } });
    if (response.success && response.data) {
        return response.data;
    }
    return [];
}

export async function getSimilarListings(id: string): Promise<Listing[]> {
    const response = await apiFetch<AuthResponse<Listing[]>>(`/api/listings/${id}/similar`);
    if (response.success && response.data) {
        return response.data;
    }
    return [];
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
    const response = await apiFetch<AuthResponse<Region[]>>('/api/regions');
    if (response.success && response.data) {
        return response.data;
    }
    return [];
}

export async function getRegionsWithDistricts(): Promise<Region[]> {
    const response = await apiFetch<AuthResponse<Region[]>>('/api/regions/with-districts');
    if (response.success && response.data) {
        return response.data;
    }
    return [];
}

// Breeds
export interface Breed {
    id: string;
    name: string;
    slug: string;
}

export async function getBreeds(): Promise<Breed[]> {
    const response = await apiFetch<AuthResponse<Breed[]>>('/api/breeds');
    if (response.success && response.data) {
        return response.data;
    }
    return [];
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
    const response = await apiFetch<AuthResponse<KopkariEvent[]>>('/api/events/upcoming', { params: { limit } });
    if (response.success && response.data) {
        return response.data;
    }
    return [];
}

export async function getEvent(slug: string): Promise<KopkariEvent> {
    const response = await apiFetch<AuthResponse<KopkariEvent>>(`/api/events/${slug}`);
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error('Event not found');
}

// User listings
export async function createListingDraft(data: any): Promise<Listing> {
    const response = await apiFetch<AuthResponse<Listing>>('/api/my/listings', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message || 'Failed to create listing');
}

export async function updateListingDraft(id: string, data: any): Promise<Listing> {
    const response = await apiFetch<AuthResponse<Listing>>(`/api/my/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message || 'Failed to update listing');
}

export async function submitListingForReview(id: string): Promise<Listing> {
    const response = await apiFetch<AuthResponse<Listing>>(`/api/my/listings/${id}/submit`, {
        method: 'POST',
    });
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message || 'Failed to submit listing');
}

// Media
export async function getSignedUploadUrl(
    entityType: string,
    contentType: string
): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    const response = await apiFetch<AuthResponse<{ uploadUrl: string; fileUrl: string; key: string }>>('/api/media/signed-url', {
        method: 'POST',
        body: JSON.stringify({ entityType, contentType }),
    });
    if (response.success && response.data) {
        return response.data;
    }
    throw new Error(response.message || 'Failed to get upload URL');
}

export async function attachMediaToListing(
    listingId: string,
    media: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number }>
): Promise<void> {
    const response = await apiFetch<AuthResponse<void>>('/api/media/attach', {
        method: 'POST',
        body: JSON.stringify({ listingId, media }),
    });
    if (!response.success) {
        throw new Error(response.message || 'Failed to attach media');
    }
}

// Favorites
export async function addToFavorites(listingId: string): Promise<void> {
    const response = await apiFetch<AuthResponse<void>>(`/api/listings/${listingId}/favorite`, { method: 'POST' });
    if (!response.success) {
        throw new Error(response.message || 'Failed to add to favorites');
    }
}

export async function removeFromFavorites(listingId: string): Promise<void> {
    const response = await apiFetch<AuthResponse<void>>(`/api/listings/${listingId}/favorite`, { method: 'DELETE' });
    if (!response.success) {
        throw new Error(response.message || 'Failed to remove from favorites');
    }
}

// Auth
export interface AuthResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    timestamp: string;
}

export interface AdminLoginResponse {
    user: {
        id: string;
        username: string;
        displayName: string;
        isVerified: boolean;
        isAdmin: boolean;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    };
}

export interface UserMeResponse {
    id: string;
    username?: string;
    displayName: string;
    avatarUrl?: string;
    isVerified: boolean;
    phone?: string;
    isAdmin: boolean;
}

export async function adminLogin(username: string, password: string): Promise<AuthResponse<AdminLoginResponse>> {
    return apiFetch('/api/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

export async function startTelegramAuth(returnUrl?: string): Promise<AuthResponse<{ sessionId: string; botDeepLink: string; expiresIn: number }>> {
    return apiFetch('/api/auth/telegram/start', {
        method: 'POST',
        body: JSON.stringify({ returnUrl }),
    });
}

export async function verifyCode(code: string): Promise<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>> {
    return apiFetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
    });
}

export async function refreshTokens(): Promise<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>> {
    return apiFetch('/api/auth/refresh', {
        method: 'POST',
    });
}

export async function getCurrentUser(): Promise<AuthResponse<UserMeResponse>> {
    return apiFetch('/api/auth/me');
}

export async function logout(): Promise<AuthResponse<null>> {
    return apiFetch('/api/auth/logout', { method: 'POST' });
}
