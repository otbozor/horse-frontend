import { Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';

// Disable static generation for this page
export const dynamicParams = false;
export const revalidate = 0;

const AdminListingsContent = dynamic(() => import('@/components/admin/AdminListingsContent'), {
    ssr: false,
    loading: () => (
        <AdminLayout>
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        </AdminLayout>
    ),
});

export default function AdminListingsPage() {
    return <AdminListingsContent />;
}
