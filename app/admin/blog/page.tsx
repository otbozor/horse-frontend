'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, Loader2, FileText, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success && data.data) {
                setPosts(data.data || []);
            }
        } catch (err: any) {
            setError(err.message || 'Xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            setProcessingId(id);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}/publish`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await response.json();

            if (data.success) {
                await loadPosts();
            } else {
                alert('Xatolik: ' + data.message);
            }
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Maqolani o\'chirishni xohlaysizmi?')) return;

        try {
            setProcessingId(id);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                await loadPosts();
            }
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">Xatolik: {error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog maqolalari</h1>
                    <p className="text-slate-500 text-sm">Barcha blog maqolalarini boshqaring va tahrirlang</p>
                </div>
                <Link href="/admin/blog/new" className="btn btn-primary btn-sm">
                    <Plus className="w-4 h-4" />
                    Yangi maqola
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {posts.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Hozircha maqolalar topilmadi</p>
                        <Link href="/admin/blog/new" className="text-primary-600 hover:underline mt-2 inline-block">
                            Yangi maqola qo'shish
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Rasm</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Sarlavha</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Holat</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Statistika</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Sana</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {post.coverImage ? (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                                    <img
                                                        src={post.coverImage.startsWith('http') ? post.coverImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${post.coverImage}`}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Rasm';
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                                                    <ImageIcon className="w-6 h-6 text-slate-300" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs xl:max-w-md">
                                                <p className="text-sm font-semibold text-slate-900 truncate" title={post.title}>
                                                    {post.title}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {post.slug}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {post.status === 'PUBLISHED' ? 'Nashr qilingan' : 'Qoralama'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {post.viewCount || 0}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {post.status === 'PUBLISHED' ? (
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                        title="Ko'rish"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePublish(post.id)}
                                                        disabled={processingId === post.id}
                                                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                        title="Nashr qilish"
                                                    >
                                                        {processingId === post.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/blog/${post.id}/edit`}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                    title="Tahrirlash"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    disabled={processingId === post.id}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="O'chirish"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
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
