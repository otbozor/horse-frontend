'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Backend API bilan bog'lash
        // Hozircha mock data
        setIsLoading(false);
        setPosts([]);
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Blog
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Ot parvarishi va ko'pkari haqida
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Otlarni parvarish qilish, ularga qarash va ko'pkari voqealari haqida foydali ma'lumotlar
                </p>
            </div>

            {/* Empty State */}
            {!isLoading && posts.length === 0 && (
                <div className="max-w-md mx-auto text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Hozircha maqolalar yo'q
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Tez orada foydali maqolalar bilan qaytamiz
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Bosh sahifaga qaytish
                    </Link>
                </div>
            )}

            {/* Blog Posts Grid - Will be populated later */}
            {posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <article key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 card-hover">
                            {post.imageUrl && (
                                <div className="aspect-video bg-slate-200 dark:bg-slate-700">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.publishedAt).toLocaleDateString('uz-UZ')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {post.author}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
                                >
                                    Batafsil
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
