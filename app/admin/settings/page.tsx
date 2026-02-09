'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { changeAdminPassword } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Barcha maydonlarni to\'ldiring');
            return;
        }

        if (newPassword.length < 6) {
            setError('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Yangi parollar mos kelmayapti');
            return;
        }

        try {
            setIsLoading(true);
            const response = await changeAdminPassword(currentPassword, newPassword);

            if (response.success) {
                setSuccess('Parol muvaffaqiyatli o\'zgartirildi! 3 sekunddan keyin login sahifasiga yo\'naltirilasiz...');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 3000);
            } else {
                setError(response.message || 'Xatolik yuz berdi');
            }
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Sozlamalar</h1>
                <p className="text-slate-500">Admin profil sozlamalari</p>
            </div>

            <div className="max-w-2xl">
                {/* Security Settings */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Xavfsizlik</h2>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Joriy parol
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                                    placeholder="Joriy parolingizni kiriting"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Yangi parol
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                                    placeholder="Yangi parolni kiriting (kamida 6 ta belgi)"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Yangi parolni tasdiqlang
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                                    placeholder="Yangi parolni qayta kiriting"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary sm:min-w-[200px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                    <Shield className="w-4 h-4 text-white" />
                                )}
                                <span className="text-white">Parolni yangilash</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                        <strong>Eslatma:</strong> Parolni o'zgartirgandan keyin qayta login qilishingiz kerak bo'ladi.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
