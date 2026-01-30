'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, Users, FileText, Settings, LogOut } from 'lucide-react';
import { logout } from '@/lib/api';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'E\'lonlar', href: '/admin/listings', icon: List },
    { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
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
    return (
        <div className="min-h-screen bg-slate-100 pl-64">
            <AdminSidebar />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
