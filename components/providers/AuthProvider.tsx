'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

    const fetchUser = async () => {
        try {
            setIsLoading(true);

            // Check if we have a token before making the request
            const hasToken = typeof window !== 'undefined' &&
                (localStorage.getItem('accessToken') || document.cookie.includes('accessToken'));

            console.log('👤 AuthProvider fetchUser:', {
                hasToken,
                accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken')?.substring(0, 20) + '...' : 'N/A',
            });

            if (!hasToken) {
                console.log('❌ No token found, user not authenticated');
                setUser(null);
                setIsLoading(false);
                return;
            }

            console.log('📞 Calling getCurrentUser API...');
            const response = await getCurrentUser();
            console.log('📡 getCurrentUser response:', response);

            // Check if response indicates user is not authenticated
            if (!response.success || !response.data) {
                console.log('❌ getCurrentUser failed:', response);
                // Clear invalid tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                setUser(null);
                return;
            }

            console.log('✅ User authenticated:', response.data);
            setUser({
                id: response.data.id,
                displayName: response.data.displayName,
                telegramUsername: response.data.username,
                username: response.data.username,
                isVerified: response.data.isVerified,
                avatarUrl: response.data.avatarUrl,
                phone: response.data.phone,
                isAdmin: response.data.isAdmin,
            });
        } catch (error) {
            console.error('❌ AuthProvider error:', error);
            // Not authenticated or error - clear tokens
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

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
