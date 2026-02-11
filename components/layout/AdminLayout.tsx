'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, List, Users, FileText, Settings, LogOut, Loader2, Package, Trophy } from 'lucide-react';
import { logout } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'E\'lonlar', href: '/admin/listings', icon: List },
    { name: 'Mahsulotlar', href: '/admin/mahsulotlar', icon: Package },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
    { name: "Ko'pkari", href: '/admin/kopkari', icon: Trophy },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">Ot<span className="text-primary-500">Admin</span></span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Chiqish</span>
                </button>
            </div>
        </div>
    );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('🔐 AdminLayout - Auth State:', { user: !!user, isAdmin: user?.isAdmin, isLoading });

        // Check if user is authenticated and is admin
        if (!isLoading && (!user || !user.isAdmin)) {
            console.log('❌ Not admin, redirecting to admin login...');
            router.push('/admin/login');
        }
    }, [user, isLoading, router]);

    // Show loading state
    if (isLoading) {
        console.log('⏳ AdminLayout - Loading...');
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-slate-600">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authenticated (will redirect)
    if (!user || !user.isAdmin) {
        console.log('❌ AdminLayout - No admin user, will redirect...');
        return null;
    }

    console.log('✅ AdminLayout - Rendering for admin:', user.displayName);

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminSidebar />
            <div className="pl-64">
                <main className="p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
