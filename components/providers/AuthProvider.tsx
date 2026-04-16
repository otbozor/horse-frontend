'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getCurrentUser, logout as apiLogout, UserMeResponse, AuthResponse } from '@/lib/api';

interface User {
    id: string;
    displayName: string;
    telegramUsername?: string;
    username?: string;
    isVerified: boolean;
    avatarUrl?: string;
    phone?: string;
    isAdmin: boolean;
    listingCredits: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            setIsLoading(true);

            // Don't use localStorage/cookie check as a gate — httpOnly cookies are invisible
            // to document.cookie. Always try the API; apiFetch handles 401→refresh→retry.
            const response = await getCurrentUser();

            if (!response.success || !response.data) {
                setUser(null);
                return;
            }

            setUser({
                id: response.data.id,
                displayName: response.data.displayName,
                telegramUsername: response.data.telegramUsername,
                username: response.data.username,
                isVerified: response.data.isVerified,
                avatarUrl: response.data.avatarUrl,
                phone: response.data.phone,
                isAdmin: response.data.isAdmin,
                listingCredits: response.data.listingCredits ?? 3,
            });
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            // Redirect to home
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refetch = async () => {
        await fetchUser();
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refetch,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
