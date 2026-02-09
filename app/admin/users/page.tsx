'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Users, Ban, CheckCircle, Search, Shield, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface User {
    id: string;
    displayName: string;
    telegramUsername?: string;
    phone?: string;
    isAdmin: boolean;
    isVerified: boolean;
    status: 'ACTIVE' | 'BANNED' | 'DELETED';
    createdAt: string;
    _count: {
        listings: number;
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [statusFilter, page]);

    const fetchUsers = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users?page=${page}&limit=20`;
            if (statusFilter) url += `&status=${statusFilter}`;

            const res = await fetch(url, {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data.data);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId: string) => {
        if (!confirm('Foydalanuvchini bloklashni xohlaysizmi?')) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/ban`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to ban user:', error);
        }
    };

    const handleUnban = async (userId: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}/unban`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to unban user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telegramUsername?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            ACTIVE: 'bg-green-100 text-green-700',
            BANNED: 'bg-red-100 text-red-700',
            DELETED: 'bg-gray-100 text-gray-700',
        };
        const labels = {
            ACTIVE: 'Faol',
            BANNED: 'Bloklangan',
            DELETED: 'O\'chirilgan',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Foydalanuvchilar</h1>
                    <p className="text-slate-500 text-sm">Platformadagi barcha foydalanuvchilarni boshqaring va moderatsiya qiling</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ism yoki telegram username orqali qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all min-w-[160px]"
                    >
                        <option value="">Barcha statuslar</option>
                        <option value="ACTIVE">Faol</option>
                        <option value="BANNED">Bloklangan</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Foydalanuvchi</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Aloqa</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">E'lonlar</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sana</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {user.displayName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sm font-semibold text-slate-900">{user.displayName}</span>
                                                        {user.isAdmin && (
                                                            <span title="Admin"><Shield className="w-3.5 h-3.5 text-amber-500" /></span>
                                                        )}
                                                        {user.isVerified && (
                                                            <span title="Tasdiqlangan"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-mono">{user.id.split('-')[0]}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm text-slate-600">
                                                    {user.telegramUsername ? `@${user.telegramUsername}` : '-'}
                                                </span>
                                                {user.phone && (
                                                    <span className="text-xs text-slate-400">{user.phone}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-900">{user._count.listings}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.isAdmin && (
                                                    user.status === 'ACTIVE' ? (
                                                        <button
                                                            onClick={() => handleBan(user.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Bloklash"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnban(user.id)}
                                                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                            title="Faollashtirish"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Foydalanuvchilar topilmadi</h3>
                        <p className="text-sm text-slate-500">Qidiruv yoki filtr parametrlarini o'zgartirib ko'ring</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-secondary btn-sm disabled:opacity-50"
                        >
                            Oldingi
                        </button>
                        <span className="text-xs font-medium text-slate-500">
                            Sahifa {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-secondary btn-sm disabled:opacity-50"
                        >
                            Keyingi
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
