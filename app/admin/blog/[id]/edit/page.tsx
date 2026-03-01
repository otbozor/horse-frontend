'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [existingCoverImage, setExistingCoverImage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        keywords: '',
    });

    useEffect(() => {
        loadPost();
    }, [postId]);

    const loadPost = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/blog/posts/${postId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            const post = data.data || data;

            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                keywords: post.keywords || '',
            });

            if (post.coverImage) {
                const imgUrl = post.coverImage.startsWith('http')
                    ? post.coverImage
                    : `${API_URL}${post.coverImage}`;
                setExistingCoverImage(imgUrl);
                setPreviewUrl(imgUrl);
            }
        } catch (err: any) {
            setError('Maqola yuklanmadi: ' + err.message);
        } finally {
            setIsFetching(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        setCoverImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setExistingCoverImage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title || !formData.content || !formData.slug) {
            setError('Sarlavha, slug va matn majburiy');
            return;
        }

        try {
            setIsLoading(true);

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('slug', formData.slug);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('content', formData.content);
            submitData.append('keywords', formData.keywords);
            if (coverImageFile) {
                submitData.append('coverImage', coverImageFile);
            }

            const response = await fetch(`${API_URL}/api/admin/blog/posts/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: submitData,
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

    if (isFetching) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Orqaga
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Maqolani tahrirlash</h1>
                </div>
                <button
                    type="submit"
                    form="blog-edit-form"
                    disabled={isLoading}
                    className="btn btn-primary btn-sm min-w-[140px]"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                        <Save className="w-4 h-4 text-white" />
                    )}
                    <span className="text-white">Saqlash</span>
                </button>
            </div>

            <form id="blog-edit-form" onSubmit={handleSubmit} className="max-w-5xl">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
                        <X className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sarlavha *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-slate-900 transition-all font-medium text-lg placeholder:text-slate-400"
                                    placeholder="Maqola sarlavhasini kiriting..."
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Slug *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">blog/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="w-full pl-[52px] pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-slate-50 text-slate-600 transition-all text-sm font-mono"
                                        placeholder="url-manzili"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maqola matni *</label>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                    placeholder="Maqola matnini kiriting..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-primary-600" />
                                Rasm va Tavsif
                            </h3>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Muqova rasmi</label>
                                {previewUrl ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                            </button>
                                            <button type="button" onClick={() => { setCoverImageFile(null); setPreviewUrl(''); setExistingCoverImage(''); }} className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-all text-slate-500">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium">Rasm yuklash (max 5MB)</span>
                                    </button>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qisqacha tavsif</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-slate-900 text-sm leading-relaxed transition-all modal-scroll"
                                    rows={4}
                                    placeholder="Maqola haqida qisqacha mazmun..."
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    SEO Kalit so'zlar
                                </label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white text-slate-900 text-sm transition-all"
                                    placeholder="ot, qorabayir, ot bozori, ..."
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-slate-400 mt-1">Vergul bilan ajrating: ot, sport ot, ot sotish</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
