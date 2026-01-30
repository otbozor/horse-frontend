'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';

export default function BlogAdminPage() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Blog boshqaruvi</h1>
                <p className="text-slate-500">Maqolalar va kategoriyalar</p>
            </div>

            <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                <p className="text-slate-500">Blog boshqaruvi tez kunda ishga tushadi...</p>
            </div>
        </AdminLayout>
    )
}
