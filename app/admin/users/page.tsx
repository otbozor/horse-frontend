'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Users, Ban, CheckCircle, Search, Shield } from 'lucide-react';

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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Foydalanuvchilar</h1>
                <p className="text-slate-500">Platformadagi barcha foydalanuvchilarni boshqaring</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Foydalanuvchi qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">Barcha statuslar</option>
                        <option value="ACTIVE">Faol</option>
                        <option value="BANNED">Bloklangan</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Foydalanuvchi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Telegram
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    E'lonlar
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Ro'yxatdan o'tgan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                                    Harakatlar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                <span className="text-primary-700 font-semibold">
                                                    {user.displayName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-900">{user.displayName}</span>
                                                    {user.isAdmin && (
                                                        <Shield className="w-4 h-4 text-amber-500" title="Admin" />
                                                    )}
                                                    {user.isVerified && (
                                                        <CheckCircle className="w-4 h-4 text-green-500" title="Tasdiqlangan" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {user.telegramUsername ? `@${user.telegramUsername}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {user._count.listings}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.isAdmin && (
                                                user.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleBan(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Bloklash"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnban(user.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Oldingi
                            </button>
                            <span className="text-sm text-slate-600">
                                Sahifa {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Keyingi
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Foydalanuvchilar topilmadi
                    </h3>
                    <p className="text-slate-500">
                        Qidiruv yoki filtr parametrlarini o'zgartiring
                    </p>
                </div>
            )}
        </AdminLayout>
    );
}
