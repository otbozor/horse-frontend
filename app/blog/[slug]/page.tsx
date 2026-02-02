import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';

async function getBlogPost(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/posts/${slug}`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
        return null;
    }
}

async function getRecentPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/posts/recent?limit=3`, {
            cache: 'no-store',
        });
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Failed to fetch recent posts:', error);
        return [];
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const [post, recentPosts] = await Promise.all([
        getBlogPost(params.slug),
        getRecentPosts(),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Blogga qaytish
                    </Link>

                    <div className="max-w-4xl">
                        {post.category && (
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm font-medium text-primary-100">
                                    {post.category.name}
                                </span>
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-primary-100">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.publishedAt).toLocaleDateString('uz-UZ', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {post.viewCount} ko'rildi
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <article className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Cover Image */}
                            {post.coverImage && (
                                <div className="aspect-video bg-slate-100">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                {post.excerpt && (
                                    <div className="text-lg text-slate-600 mb-6 pb-6 border-b border-slate-200">
                                        {post.excerpt}
                                    </div>
                                )}

                                <div
                                    className="prose prose-slate max-w-none
                                        prose-headings:font-bold prose-headings:text-slate-900
                                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                        prose-p:text-slate-600 prose-p:leading-relaxed
                                        prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                                        prose-strong:text-slate-900 prose-strong:font-semibold
                                        prose-ul:list-disc prose-ol:list-decimal
                                        prose-li:text-slate-600
                                        prose-img:rounded-xl prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                                />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Recent Posts */}
                            {recentPosts.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                                        So'nggi maqolalar
                                    </h3>
                                    <div className="space-y-4">
                                        {recentPosts.filter((p: any) => p.id !== post.id).slice(0, 3).map((recentPost: any) => (
                                            <Link
                                                key={recentPost.id}
                                                href={`/blog/${recentPost.slug}`}
                                                className="group block"
                                            >
                                                <h4 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                                                    {recentPost.title}
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(recentPost.publishedAt).toLocaleDateString('uz-UZ', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                                <h3 className="text-lg font-bold mb-2">
                                    Ot sotmoqchimisiz?
                                </h3>
                                <p className="text-sm text-primary-100 mb-4">
                                    Bepul e'lon joylashtiring va minglab xaridorlarga yeting
                                </p>
                                <Link
                                    href="/elon/yaratish"
                                    className="btn bg-white text-primary-700 hover:bg-primary-50 w-full justify-center"
                                >
                                    E'lon joylash
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
