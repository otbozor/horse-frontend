'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getAdminStats } from '@/lib/admin-api';
import { Users, FileCheck, Eye, Activity, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setIsLoading(true);
                const response = await getAdminStats();
                if (response.success && response.data) {
                    setStats(response.data);
                } else {
                    throw new Error(response.message || 'Ma\'lumotlarni yuklashda xatolik');
                }
            } catch (err: any) {
                setError(err.message || 'Ma\'lumotlarni yuklashda xatolik');
            } finally {
                setIsLoading(false);
            }
        }
        loadStats();
    }, []);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">Xatolik: {error}</p>
                </div>
            </AdminLayout>
        );
    }

    if (!stats) return null;

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Platforma bo'yicha umumiy statistika</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.totalUsers}</h3>
                    <p className="text-slate-500 text-sm">Jami foydalanuvchilar</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <span className="text-amber-500 text-sm font-medium">Action</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.pendingListings}</h3>
                    <p className="text-slate-500 text-sm">Kutilayotgan e'lonlar</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <span className="text-green-500 text-sm font-medium">✓</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.approvedListings}</h3>
                    <p className="text-slate-500 text-sm">Tasdiqlangan e'lonlar</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Eye className="w-6 h-6" />
                        </div>
                        <span className="text-blue-500 text-sm font-medium">Today</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stats.todayViews}</h3>
                    <p className="text-slate-500 text-sm">Bugungi ko'rishlar</p>
                </div>
            </div>

            {stats.recentActivity && stats.recentActivity.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-600" />
                        So'nggi harakatlar
                    </h2>
                    <div className="space-y-4">
                        {stats.recentActivity.map((activity: any) => (
                            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {activity.user || activity.admin}
                                        <span className="font-normal text-slate-500 dark:text-slate-400"> — {activity.action}</span>
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
