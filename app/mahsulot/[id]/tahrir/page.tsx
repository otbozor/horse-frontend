'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Package, Save } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { RequireAuth } from '@/components/auth/RequireAuth';

interface Category {
    id: string;
    name: string;
}

function EditProductForm() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [productSlug, setProductSlug] = useState('');

    const [form, setForm] = useState({
        title: '',
        categoryId: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'UZS',
        hasDelivery: false,
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                const [catRes, myRes] = await Promise.all([
                    fetch(`${API_URL}/api/products/categories`),
                    fetch(`${API_URL}/api/my/products`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (catRes.ok) {
                    const cats = await catRes.json();
                    setCategories(Array.isArray(cats) ? cats : []);
                }

                if (myRes.ok) {
                    const myData = await myRes.json();
                    const products = Array.isArray(myData?.data) ? myData.data : [];
                    const product = products.find((p: any) => p.id === productId);
                    if (product) {
                        setProductSlug(product.slug);
                        setForm({
                            title: product.title || '',
                            categoryId: product.category?.id || '',
                            description: product.description || '',
                            priceAmount: String(Number(product.priceAmount)) || '',
                            priceCurrency: product.priceCurrency || 'UZS',
                            hasDelivery: product.hasDelivery || false,
                        });
                    } else {
                        setError("Mahsulot topilmadi yoki siz uning egasi emassiz");
                    }
                }
            } catch {
                setError('Xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId, API_URL]);

    const handleChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) return setError('Sarlavha kiritish majburiy');
        if (!form.priceAmount || Number(form.priceAmount) <= 0) return setError("To'g'ri narx kiriting");

        setSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/my/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: form.title,
                    categoryId: form.categoryId || undefined,
                    description: form.description || undefined,
                    priceAmount: Number(form.priceAmount),
                    priceCurrency: form.priceCurrency,
                    hasDelivery: form.hasDelivery,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Xatolik yuz berdi');

            const slug = data.slug || productSlug;
            router.push(`/mahsulotlar/${slug}`);
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error && !form.title) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Orqaga
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mahsulotni tahrirlash</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                    Ma&apos;lumotlarni o&apos;zgartirib saqlang
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="label">Mahsulot nomi *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="Masalan: Egar, Em-xashak, Jilov..."
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="label">Kategoriya</label>
                    <CustomSelect
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        placeholder="Kategoriya tanlang"
                        options={[
                            { value: '', label: 'Kategoriya tanlang' },
                            ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                        ]}
                    />
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Narx *</label>
                        <input
                            name="priceAmount"
                            type="number"
                            value={form.priceAmount}
                            onChange={handleChange}
                            className="input"
                            placeholder="0"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Valyuta</label>
                        <CustomSelect
                            name="priceCurrency"
                            value={form.priceCurrency}
                            onChange={handleChange}
                            options={[
                                { value: 'UZS', label: "So'm (UZS)" },
                                { value: 'USD', label: 'Dollar (USD)' },
                            ]}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="label">Tavsif</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="input min-h-[100px] resize-none"
                        placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
                        rows={4}
                    />
                </div>

                {/* Delivery */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="hasDelivery"
                        checked={form.hasDelivery}
                        onChange={handleCheckbox}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Yetkazib berish mavjud
                    </span>
                </label>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 btn btn-secondary justify-center"
                    >
                        Bekor qilish
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 btn btn-primary justify-center"
                    >
                        {saving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</>
                        ) : (
                            <><Save className="w-4 h-4" /> Saqlash</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <RequireAuth>
            <EditProductForm />
        </RequireAuth>
    );
}
