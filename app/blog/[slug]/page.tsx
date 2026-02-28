import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, ArrowLeft, Tag } from 'lucide-react';
import { BlogViewTracker } from '@/components/blog/BlogViewTracker';

async function getBlogPost(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blog/posts/${slug}`, {
            next: { revalidate: 300 },
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
            next: { revalidate: 300 },
        });
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Failed to fetch recent posts:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getBlogPost(params.slug);
    if (!post) return { title: 'Maqola topilmadi | Otbozor' };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://otbozor.uz';

    return {
        title: `${post.title} | Otbozor Blog`,
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            type: 'article',
            url: `${siteUrl}/blog/${post.slug}`,
            publishedTime: post.publishedAt,
            images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.title,
            images: post.coverImage ? [post.coverImage] : [],
        },
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const [post, recentPosts] = await Promise.all([
        getBlogPost(params.slug),
        getRecentPosts(),
    ]);

    if (!post) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://otbozor.uz';
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || post.title,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        image: post.coverImage ? [post.coverImage] : [],
        url: `${siteUrl}/blog/${post.slug}`,
        publisher: {
            '@type': 'Organization',
            name: 'Otbozor',
            url: siteUrl,
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogViewTracker slug={params.slug} />
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
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {/* Cover Image */}
                            {post.coverImage && (
                                <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                {post.excerpt && (
                                    <div className="text-lg text-slate-600 dark:text-slate-300 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                        {post.excerpt}
                                    </div>
                                )}

                                <div
                                    className="text-slate-700 dark:text-slate-300 leading-relaxed
                                        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-slate-900 dark:[&_h2]:text-slate-100
                                        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-slate-900 dark:[&_h3]:text-slate-100
                                        [&_p]:mb-3
                                        [&_strong]:font-bold
                                        [&_em]:italic
                                        [&_s]:line-through
                                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
                                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
                                        [&_li]:mb-1
                                        [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-3
                                        [&_hr]:border-slate-200 [&_hr]:my-6"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Recent Posts */}
                            {recentPosts.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                                        So&apos;nggi maqolalar
                                    </h3>
                                    <div className="space-y-4">
                                        {recentPosts.filter((p: any) => p.id !== post.id).slice(0, 3).map((recentPost: any) => (
                                            <Link
                                                key={recentPost.id}
                                                href={`/blog/${recentPost.slug}`}
                                                className="group block"
                                            >
                                                <h4 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                                                    {recentPost.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
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
