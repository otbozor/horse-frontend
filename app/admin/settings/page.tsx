'use client';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { Settings, Globe, Bell, Shield, Palette, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Sozlamalar</h1>
                <p className="text-slate-500">Platforma sozlamalarini boshqaring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Umumiy sozlamalar</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Sayt nomi</label>
                            <input type="text" className="input" defaultValue="Otbozor" />
                        </div>
                        <div>
                            <label className="label">Sayt tavsifi</label>
                            <textarea className="input h-24" defaultValue="O'zbekiston ot savdo platformasi" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Saytni faollashtirish</p>
                                <p className="text-sm text-slate-500">Saytni foydalanuvchilarga ko'rsatish</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Bell className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Bildirishnomalar</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Yangi e'lonlar</p>
                                <p className="text-sm text-slate-500">Yangi e'lon qo'shilganda xabar berish</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Email xabarnomalar</p>
                                <p className="text-sm text-slate-500">Muhim voqealar haqida email yuborish</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Xavfsizlik</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Ikki bosqichli autentifikatsiya</p>
                                <p className="text-sm text-slate-500">Qo'shimcha xavfsizlik darajasi</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                        <div>
                            <label className="label">Parolni o'zgartirish</label>
                            <input type="password" className="input mb-2" placeholder="Joriy parol" />
                            <input type="password" className="input mb-2" placeholder="Yangi parol" />
                            <input type="password" className="input" placeholder="Yangi parolni tasdiqlang" />
                        </div>
                        <button className="btn btn-primary">
                            Parolni yangilash
                        </button>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Palette className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Tashqi ko'rinish</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Asosiy rang</label>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 cursor-pointer border-2 border-blue-800"></div>
                                <div className="w-10 h-10 rounded-lg bg-green-600 cursor-pointer"></div>
                                <div className="w-10 h-10 rounded-lg bg-purple-600 cursor-pointer"></div>
                                <div className="w-10 h-10 rounded-lg bg-orange-600 cursor-pointer"></div>
                            </div>
                        </div>
                        <div>
                            <label className="label">Logo</label>
                            <input type="file" className="input" accept="image/*" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <button className="btn btn-primary btn-lg">
                    O'zgarishlarni saqlash
                </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <Settings className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Sozlamalar haqida</h3>
                        <p className="text-sm text-blue-700">
                            Bu sahifadagi sozlamalar hali backend bilan bog'lanmagan. API integratsiyasi amalga oshirilganda,
                            barcha o'zgarishlar avtomatik saqlanadi va qo'llaniladi.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
