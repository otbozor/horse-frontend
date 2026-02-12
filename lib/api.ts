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

    // Get token from localStorage for Authorization header
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    console.log('🌐 API Request:', {
        endpoint,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    });

    const response = await fetch(url, {
        ...init,
        cache: init.cache ?? 'no-store', // Disable Next.js caching by default
        credentials: 'include', // Still send cookies
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Bearer token if available
            ...init.headers,
        },
    });

    console.log('📡 API Response:', {
        endpoint,
        status: response.status,
        ok: response.ok,
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Read the actual error message from server response
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || 'Unauthorized';

            // Only clear tokens for non-login endpoints
            const isLoginEndpoint = endpoint.includes('/auth/') && (endpoint.includes('/login') || endpoint.includes('/verify'));
            if (!isLoginEndpoint && typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }

            return { success: false, message: errorMessage } as T;
        }

        const error = await response.json().catch(() => ({}));
        const errorMessage = error.message || `HTTP ${response.status}`;
        console.error(`API Error [${response.status}]:`, errorMessage);
        throw new Error(errorMessage);
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
        phone?: string;
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
    // Ensure limit doesn't exceed 50
    const safeLimit = Math.min(limit, 50);
    const response = await apiFetch<AuthResponse<Listing[]>>('/api/listings/featured', { params: { limit: safeLimit } });
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
    // Ensure limit doesn't exceed 50
    const safeLimit = Math.min(limit, 50);
    const response = await apiFetch<AuthResponse<KopkariEvent[]>>('/api/events/upcoming', { params: { limit: safeLimit } });
    if (response.success && response.data) {
        return response.data;
    }
    return [];
}

export async function getAllPublicEvents(): Promise<KopkariEvent[]> {
    const response = await apiFetch<AuthResponse<KopkariEvent[]>>('/api/events');
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

export async function isFavorite(listingId: string): Promise<boolean> {
    const response = await apiFetch<AuthResponse<{ isFavorite: boolean }>>(`/api/listings/${listingId}/is-favorite`);
    return response.data?.isFavorite ?? false;
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
    const response = await apiFetch<AuthResponse<AdminLoginResponse>>('/api/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    // Save tokens to localStorage for production (cookie fallback)
    if (response.success && response.data?.tokens) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
    }

    return response;
}

export async function startTelegramAuth(returnUrl?: string): Promise<AuthResponse<{ sessionId: string; botDeepLink: string; expiresIn: number }>> {
    return apiFetch('/api/auth/telegram/start', {
        method: 'POST',
        body: JSON.stringify({ returnUrl }),
    });
}

export async function verifyCode(code: string): Promise<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>> {
    const response = await apiFetch<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ code }),
    });

    // Save tokens to localStorage for production (cookie fallback)
    if (response.success && response.data?.tokens) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
    }

    return response;
}

export async function refreshTokens(): Promise<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>> {
    const response = await apiFetch<AuthResponse<{ tokens: { accessToken: string; refreshToken: string; expiresIn: string } }>>('/api/auth/refresh', {
        method: 'POST',
    });

    // Save tokens to localStorage for production (cookie fallback)
    if (response.success && response.data?.tokens) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
    }

    return response;
}

export async function getCurrentUser(): Promise<AuthResponse<UserMeResponse>> {
    return apiFetch('/api/auth/me');
}

export async function logout(): Promise<AuthResponse<null>> {
    // Clear localStorage tokens
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
    return apiFetch('/api/auth/logout', { method: 'POST' });
}
