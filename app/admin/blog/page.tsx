'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const handleDelete = async (id: string) => {
        if (!confirm('Maqolani o\'chirishni xohlaysizmi?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                await loadPosts();
            }
        } catch (err: any) {
            alert('Xatolik: ' + err.message);
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
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog maqolalari</h1>
                    <p className="text-slate-500">Barcha blog maqolalarini boshqaring</p>
                </div>
                <Link href="/admin/blog/new" className="btn btn-primary">
                    <Plus className="w-5 h-5" />
                    Yangi maqola
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Hozircha maqolalar yo'q</h3>
                    <p className="text-slate-500 mb-6">Birinchi blog maqolangizni yarating</p>
                    <Link href="/admin/blog/new" className="btn btn-primary inline-flex">
                        <Plus className="w-5 h-5" />
                        Yangi maqola
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            {post.coverImage && (
                                <div className="aspect-video bg-slate-100 overflow-hidden">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${post.status === 'PUBLISHED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-amber-100 text-amber-800'
                                        }`}>
                                        {post.status === 'PUBLISHED' ? 'Nashr qilingan' : 'Qoralama'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(post.createdAt).toLocaleDateString('uz-UZ')}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                                    {post.title}
                                </h3>

                                {post.excerpt && (
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs text-slate-500">
                                        {post.author?.displayName || 'Admin'}
                                    </span>
                                    <div className="flex gap-2">
                                        {post.status === 'PUBLISHED' && (
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                title="Ko'rish"
                                                target="_blank"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                            title="Tahrirlash"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                            title="O'chirish"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
