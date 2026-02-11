'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Loader2, Save, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/products/categories/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : (data?.data ?? []));
        } catch (error) {
            console.error('Kategoriyalarni yuklashda xatolik:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ʻ/g, '')
            .replace(/'/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            name,
            slug: generateSlug(name),
        });
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.slug) {
            alert('Iltimos, barcha maydonlarni to\'ldiring');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/products/categories`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (res.ok) {
                setFormData({ name: '', slug: '' });
                setShowAddForm(false);
                fetchCategories();
            } else {
                const error = await res.json();
                alert(error.message || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Yaratishda xatolik:', error);
            alert('Xatolik yuz berdi');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!formData.name || !formData.slug) {
            alert('Iltimos, barcha maydonlarni to\'ldiring');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/products/categories/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (res.ok) {
                setEditingId(null);
                setFormData({ name: '', slug: '' });
                fetchCategories();
            } else {
                const error = await res.json();
                alert(error.message || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Yangilashda xatolik:', error);
            alert('Xatolik yuz berdi');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" kategoriyasini o'chirishni xohlaysizmi?`)) return;

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/products/categories/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                fetchCategories();
            } else {
                const error = await res.json();
                alert(error.message || 'Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('O\'chirishda xatolik:', error);
            alert('Xatolik yuz berdi');
        }
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({ name: category.name, slug: category.slug });
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', slug: '' });
    };

    return (
        <AdminLayout>
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mahsulot Kategoriyalari</h1>
                    <p className="text-slate-600">Kategoriyalarni boshqarish</p>
                </div>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingId(null);
                        setFormData({ name: '', slug: '' });
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                    {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showAddForm ? 'Bekor qilish' : 'Yangi kategoriya'}
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Yangi kategoriya qo&apos;shish</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nomi
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Egar-jabduqlar"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Slug (URL)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="egar-jabduqlar"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleCreate}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Saqlash
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setFormData({ name: '', slug: '' });
                            }}
                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Kategoriyalar topilmadi</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Nomi</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Slug</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Mahsulotlar</th>
                                <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-slate-50">
                                    {editingId === category.id ? (
                                        <>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleNameChange(e.target.value)}
                                                    className="w-full px-3 py-1 border border-slate-300 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="w-full px-3 py-1 border border-slate-300 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-slate-600">
                                                    {category._count?.products || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(category.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Saqlash"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                                        title="Bekor qilish"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-slate-900">{category.name}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-600 font-mono">{category.slug}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-slate-600">
                                                    {category._count?.products || 0} ta
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(category)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                                                        title="Tahrirlash"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id, category.name)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="O'chirish"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </AdminLayout>
    );
}
