import { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';

async function getBlogPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/posts?limit=20`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

export const metadata = {
    title: 'Blog - Ot parvarishi va ko\'pkari haqida maqolalar | Otbozor',
    description: 'Otlarni parvarish qilish, ko\'pkari musobaqalari, ot zotlari va boshqa foydali ma\'lumotlar.',
};

export default async function BlogPage() {
    const posts = await getBlogPosts();

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
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        📝
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
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Hozircha maqolalar yo'q
                    </h3>
                    <p className="text-slate-500">
                        Tez orada qiziqarli maqolalar paydo bo'ladi
                    </p>
                </div>
            )}
        </div>
    );
}
