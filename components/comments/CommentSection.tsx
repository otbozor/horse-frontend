'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Reply } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        displayName: string;
        avatarUrl?: string;
        isVerified: boolean;
    };
    replies?: Comment[];
}

export function CommentSection({ listingId, currentUserId }: { listingId: string; currentUserId?: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(currentUserId);
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetchComments();
        if (!currentUserId) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    console.log('Current user data:', data);
                    if (data.success && data.data?.id) {
                        setUserId(data.data.id);
                        console.log('User ID set to:', data.data.id);
                    }
                })
                .catch(() => { });
        } else {
            setUserId(currentUserId);
            console.log('User ID from props:', currentUserId);
        }
    }, [listingId, currentUserId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/listing/${listingId}`);
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            setComments([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || loading) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/listing/${listingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    content,
                    parentId: replyTo?.id
                }),
            });

            if (res.ok) {
                await fetchComments();
                setContent('');
                setReplyTo(null);
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Kommentni o\'chirmoqchimisiz?')) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                await fetchComments();
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const totalComments = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-12 mt-3' : ''}`}>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold flex-shrink-0">
                    {comment.user.displayName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                            {comment.user.displayName}
                        </span>
                        {comment.user.isVerified && (
                            <span className="text-primary-500">✓</span>
                        )}
                        <span className="text-sm text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString('uz-UZ', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        {userId && !isReply && (
                            <button
                                onClick={() => setReplyTo({ id: comment.id, name: comment.user.displayName })}
                                className="text-sm text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
                            >
                                <Reply className="w-3.5 h-3.5" />
                                Javob berish
                            </button>
                        )}
                        {userId && (
                            <button
                                onClick={() => {
                                    console.log('Delete clicked. userId:', userId, 'comment.user.id:', comment.user.id);
                                    handleDelete(comment.id);
                                }}
                                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                O'chirish
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map(reply => renderComment(reply, true))}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Kommentlar ({totalComments})
            </h3>

            {userId ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    {replyTo && (
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Reply className="w-4 h-4" />
                            <span>{replyTo.name}ga javob</span>
                            <button
                                type="button"
                                onClick={() => setReplyTo(null)}
                                className="text-red-500 hover:text-red-600 ml-2"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={replyTo ? "Javobingizni yozing..." : "Komment yozing..."}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 resize-none"
                        rows={3}
                        maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-slate-400">{content.length}/1000</span>
                        <button
                            type="submit"
                            disabled={!content.trim() || loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Yuborilmoqda...' : 'Yuborish'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-6 text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Fikr bildirish uchun tizimga kiring
                    </p>
                    <a
                        href="/login"
                        className="btn btn-primary inline-flex"
                    >
                        Fikr bildirish
                    </a>
                </div>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-slate-100 dark:border-slate-700 pb-6 last:border-0">
                        {renderComment(comment)}
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-center text-slate-400 py-8">
                        Hali kommentlar yo'q. Birinchi bo'lib komment qoldiring!
                    </p>
                )}
            </div>
        </div>
    );
}
