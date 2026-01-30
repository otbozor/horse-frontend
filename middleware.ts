import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        // Skip login page itself
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth cookie (accessToken set by backend)
        const accessToken = request.cookies.get('accessToken');

        if (!accessToken) {
            // Not authenticated - redirect to admin login
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Check if accessing protected user routes (profil, elon yaratish)
    if (pathname.startsWith('/profil') || pathname.includes('/elon')) {
        const accessToken = request.cookies.get('accessToken');

        if (!accessToken) {
            // Not authenticated - redirect to user login with return URL
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('returnUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/profil/:path*',
        '/elon/yaratish',
        '/elon/:path*/tahrirlash',
    ],
};
