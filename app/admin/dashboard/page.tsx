'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getAdminStats, getRegionStats } from '@/lib/admin-api';
import { Users, FileCheck, Eye, Activity, Loader2, MapPin, Package } from 'lucide-react';

interface RegionStat {
    regionId: string | null;
    name: string;
    count: number;
}

function RegionBarChart({ data, color, emptyMsg }: { data: RegionStat[]; color: string; emptyMsg: string }) {
    if (!data || data.length === 0) {
        return <p className="text-sm text-slate-400 py-4 text-center">{emptyMsg}</p>;
    }
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="space-y-2.5">
            {data.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-32 flex-shrink-0 truncate" title={item.name}>
                        {item.name}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                        <div
                            className={`h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 ${color}`}
                            style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }}
                        >
                            <span className="text-xs font-bold text-white">{item.count}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [regionStats, setRegionStats] = useState<{ listings: RegionStat[]; products: RegionStat[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setIsLoading(true);
                const [statsRes, regionRes] = await Promise.all([
                    getAdminStats(),
                    getRegionStats(),
                ]);
                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                } else {
                    throw new Error(statsRes.message || 'Ma\'lumotlarni yuklashda xatolik');
                }
                if (regionRes.success && regionRes.data) {
                    setRegionStats(regionRes.data);
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

            {/* Region charts */}
            {regionStats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-600" />
                            Ot e'lonlari — viloyat bo'yicha
                        </h2>
                        <p className="text-xs text-slate-400 mb-5">Top 10 viloyat</p>
                        <RegionBarChart
                            data={regionStats.listings}
                            color="bg-primary-500"
                            emptyMsg="E'lonlar topilmadi"
                        />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Package className="w-4 h-4 text-amber-600" />
                            Mahsulotlar — viloyat bo'yicha
                        </h2>
                        <p className="text-xs text-slate-400 mb-5">Top 10 viloyat</p>
                        <RegionBarChart
                            data={regionStats.products}
                            color="bg-amber-500"
                            emptyMsg="Mahsulotlar topilmadi"
                        />
                    </div>
                </div>
            )}

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
