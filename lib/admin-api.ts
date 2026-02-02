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

// Pending Listings
export async function getPendingListings(page = 1, limit = 20): Promise<any> {
    const response = await apiFetch('/api/admin/listings/pending', {
        params: { page, limit },
    });
    console.log('getPendingListings response:', response);
    return response;
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
