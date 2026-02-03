'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPostPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [coverImage, setCoverImage] = useState<string>('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Faqat rasm fayllarini yuklash mumkin');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        try {
            setIsUploadingImage(true);

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.data?.url) {
                setCoverImage(data.data.url);
            } else {
                alert('Rasm yuklashda xatolik');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Rasm yuklashda xatolik');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.content) {
            setError('Sarlavha va matn majburiy');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    coverImage: coverImage || undefined,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin/blog');
            } else {
                setError(data.message || 'Xatolik yuz berdi');
            }
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-5 h-5" />
                        Orqaga
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Yangi maqola</h1>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/blog" className="btn btn-outline">
                        Bekor qilish
                    </Link>
                    <button
                        type="submit"
                        form="blog-form"
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        <Save className="w-5 h-5" />
                        Nashr qilish
                    </button>
                </div>
            </div>

            <form id="blog-form" onSubmit={handleSubmit} className="max-w-4xl">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Sarlavha *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                            placeholder="Maqola sarlavhasi"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Qisqacha mazmuni
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                            rows={3}
                            placeholder="Maqolaning qisqacha tavsifi..."
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Muqova rasmi
                        </label>

                        {coverImage ? (
                            <div className="relative">
                                <img
                                    src={coverImage}
                                    alt="Cover"
                                    className="w-full h-64 object-cover rounded-lg border border-slate-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setCoverImage('')}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploadingImage ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                            <span className="text-sm text-slate-600">Yuklanmoqda...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                            <span className="text-sm text-slate-600">Rasm yuklash uchun bosing</span>
                                            <span className="text-xs text-slate-400">JPG, PNG (max 5MB)</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Matn *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-slate-900"
                            rows={20}
                            placeholder="Maqola matni..."
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
