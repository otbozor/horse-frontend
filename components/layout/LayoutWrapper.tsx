'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { SocialPopup } from '@/components/ui/SocialPopup';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');
    const isProfilRoute = pathname?.startsWith('/profil');
    const isLoginRoute = pathname === '/login';

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            {pathname === '/' && <SocialPopup />}
            <Header />
            <main className="flex-grow">{children}</main>
            {!isProfilRoute && !isLoginRoute && <Footer />}
        </div>
    );
}
