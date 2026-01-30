'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Users, Ban, CheckCircle, Search } from 'lucide-react';

export default function AdminUsersPage() {
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
                            className="input pl-10"
                        />
                    </div>
                    <select className="select w-48">
                        <option value="">Barcha statuslar</option>
                        <option value="ACTIVE">Faol</option>
                        <option value="BANNED">Bloklangan</option>
                    </select>
                </div>
            </div>

            {/* Empty State - Users management backend endpoint hali yo'q */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Foydalanuvchilar boshqaruvi
                </h2>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Bu bo'lim hali ishlab chiqilmoqda. Foydalanuvchilarni ko'rish va boshqarish funksiyalari tez orada qo'shiladi.
                </p>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Backend API integratsiyasi kutilmoqda
                </div>
            </div>

            {/* Placeholder for future users table */}
            {/* 
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Foydalanuvchi</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Telegram</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">E'lonlar</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ro'yxatdan o'tgan</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Harakatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-slate-100 last:border-0">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-primary-700 font-semibold">
                                                {user.displayName.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="font-medium">{user.displayName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">@{user.telegramUsername}</td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'}`}>
                                        {user.status === 'ACTIVE' ? 'Faol' : 'Bloklangan'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.listingsCount}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="btn btn-sm btn-ghost">
                                            Ko'rish
                                        </button>
                                        {user.status === 'ACTIVE' ? (
                                            <button className="btn btn-sm text-red-600">
                                                <Ban className="w-4 h-4" />
                                                Bloklash
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                Faollashtirish
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            */}
        </AdminLayout>
    );
}
