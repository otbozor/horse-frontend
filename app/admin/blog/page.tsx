'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Edit, Trash2, Eye, CheckCircle, Archive } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    viewCount: number;
    publishedAt?: string;
    createdAt: string;
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts`,
                {
                    credentials: 'include',
                }
            );
            const data = await res.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}/publish`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to publish post:', error);
        }
    };

    const handleArchive = async (id: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}/archive`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to archive post:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Maqolani o\'chirishni xohlaysizmi?')) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blog/posts/${id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            DRAFT: 'bg-gray-100 text-gray-700',
            PUBLISHED: 'bg-green-100 text-green-700',
            ARCHIVED: 'bg-orange-100 text-orange-700',
        };
        const labels = {
            DRAFT: 'Qoralama',
            PUBLISHED: 'Nashr qilingan',
            ARCHIVED: 'Arxivlangan',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Blog boshqaruvi</h1>
                    <p className="text-slate-500">Barcha maqolalar ({posts.length})</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yangi maqola
                </Link>
            </div>

            {/* Posts Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            ) : posts.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Sarlavha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Ko'rishlar
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                                    Sana
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                                    Amallar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{post.title}</div>
                                        {post.excerpt && (
                                            <div className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(post.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {post.viewCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('uz-UZ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {post.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handlePublish(post.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Nashr qilish"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            {post.status === 'PUBLISHED' && (
                                                <button
                                                    onClick={() => handleArchive(post.id)}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Arxivlash"
                                                >
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/blog/${post.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Tahrirlash"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Hozircha maqolalar yo'q
                    </h3>
                    <p className="text-slate-500 mb-4">
                        Birinchi maqolangizni yarating
                    </p>
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Yangi maqola
                    </Link>
                </div>
            )}
        </AdminLayout>
    );
}
