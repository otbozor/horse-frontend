import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, FileText } from 'lucide-react';
import { Pagination } from '@/components/listing/Pagination';

const BLOG_LIMIT = 12;

async function getBlogPosts(page = 1) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/posts?page=${page}&limit=${BLOG_LIMIT}`, {
            next: { revalidate: 300 },
        });
        const data = await res.json();
        if (data.success) {
            return {
                posts: data.data || [],
                pagination: data.pagination || { page: 1, limit: BLOG_LIMIT, total: 0, totalPages: 1 },
            };
        }
        return { posts: [], pagination: { page: 1, limit: BLOG_LIMIT, total: 0, totalPages: 1 } };
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return { posts: [], pagination: { page: 1, limit: BLOG_LIMIT, total: 0, totalPages: 1 } };
    }
}

export const metadata = {
    title: 'Blog - Ot parvarishi va ko\'pkari haqida maqolalar | Otbozor',
    description: 'Otlarni parvarish qilish, ko\'pkari musobaqalari, ot zotlari va boshqa foydali ma\'lumotlar.',
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const { posts, pagination } = await getBlogPosts(page);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    Blog
                </h1>
                <p className="text-lg text-slate-600">
                    Ot parvarishi, ko'pkari va boshqa foydali ma'lumotlar
                </p>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all"
                        >
                            {/* Cover Image */}
                            <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-16 h-16 text-primary-300" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                    {post.title}
                                </h3>
                                {post.excerpt && (
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(post.publishedAt).toLocaleDateString('uz-UZ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {post.viewCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Hozircha maqolalar yo'q
                    </h3>
                    <p className="text-slate-500">
                        Tez orada qiziqarli maqolalar paydo bo'ladi
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    searchParams={searchParams}
                    basePath="/blog"
                />
            )}
        </div>
    );
}
