'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Loader2, Package, CheckCircle } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface Category {
    id: string;
    name: string;
}

function CreateProductForm() {
    const router = useRouter();
    useAuth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        categoryId: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'UZS',
        hasDelivery: false,
        stockStatus: 'IN_STOCK',
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/products/categories`)
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

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
        if (!form.priceAmount || Number(form.priceAmount) <= 0) return setError('To\'g\'ri narx kiriting');

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
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
                    stockStatus: form.stockStatus,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Xatolik yuz berdi');
            }

            setSuccess(true);
            setTimeout(() => router.push('/mahsulotlar'), 2000);
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Mahsulot yuborildi!</h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Mahsulotingiz moderatsiyadan o'tgach nashr etiladi.
                    </p>
                </div>
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mahsulot joylash</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                    Ot uchun mahsulot yoki aksessuarni joylang. Admin tekshirib nashr etadi.
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

                {/* Stock status */}
                <div>
                    <label className="label">Mavjudlik holati</label>
                    <CustomSelect
                        name="stockStatus"
                        value={form.stockStatus}
                        onChange={handleChange}
                        options={[
                            { value: 'IN_STOCK', label: 'Mavjud' },
                            { value: 'OUT_OF_STOCK', label: "Sotuvda yo'q" },
                            { value: 'PREORDER', label: 'Oldindan buyurtma' },
                        ]}
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

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full justify-center"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</>
                    ) : (
                        <><Package className="w-4 h-4" /> Mahsulotni yuborish</>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function CreateProductPage() {
    return (
        <RequireAuth>
            <CreateProductForm />
        </RequireAuth>
    );
}
