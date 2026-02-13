import { apiFetch, AuthResponse } from './api';

// Admin Dashboard Stats
export async function getAdminStats(): Promise<AuthResponse<{
    pendingListings: number;
    approvedListings: number;
    totalUsers: number;
    todayViews: number;
}>> {
    return apiFetch('/api/admin/dashboard/stats');
}

// All Listings with filters (admin)
export async function getAdminListings(options?: {
    status?: string;
    isPaid?: string;
    page?: number;
    limit?: number;
}): Promise<any> {
    return apiFetch('/api/admin/listings', {
        params: {
            status: options?.status,
            isPaid: options?.isPaid,
            page: options?.page,
            limit: options?.limit,
        } as any,
    });
}

// Pending Listings
export async function getPendingListings(page = 1, limit = 20): Promise<any> {
    const response = await apiFetch('/api/admin/listings/pending', {
        params: { page, limit },
    });
    console.log('getPendingListings response:', response);
    return response;
}

// Get Listing by ID (admin)
export async function getAdminListingById(id: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/listings/${id}`);
}

// Approve Listing
export async function approveListing(listingId: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/listings/${listingId}/approve`, {
        method: 'POST',
    });
}

// Reject Listing
export async function rejectListing(listingId: string, reason: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/listings/${listingId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
    });
}

// Get Users
export async function getUsers(page = 1, limit = 20, status?: string): Promise<AuthResponse<any>> {
    return apiFetch('/api/admin/users', {
        params: { page, limit, status },
    });
}

// Ban User
export async function banUser(userId: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
    });
}

// Unban User
export async function unbanUser(userId: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
    });
}

// Audit Logs
export async function getAuditLogs(page = 1, limit = 50): Promise<AuthResponse<any>> {
    return apiFetch('/api/admin/audit-logs', {
        params: { page, limit },
    });
}

// Change Admin Password
export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<AuthResponse<any>> {
    return apiFetch('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
}

// ---- Events (Ko'pkari) ----
export async function getAdminEvents(): Promise<AuthResponse<any>> {
    return apiFetch('/api/admin/events');
}

export async function createAdminEvent(data: any): Promise<AuthResponse<any>> {
    return apiFetch('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateAdminEvent(id: string, data: any): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function publishAdminEvent(id: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/events/${id}/publish`, { method: 'POST' });
}

export async function deleteAdminEvent(id: string): Promise<AuthResponse<any>> {
    return apiFetch(`/api/admin/events/${id}`, { method: 'DELETE' });
}
