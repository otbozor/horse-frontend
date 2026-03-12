'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from 'lucide-react';

interface ListingGalleryProps {
    media: Array<{
        id: string;
        url: string;
        thumbUrl?: string;
        type: 'IMAGE' | 'VIDEO';
    }>;
    title: string;
}

export function ListingGallery({ media, title }: ListingGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const nextSlide = useCallback(() => setActiveIndex((prev) => (prev + 1) % media.length), [media.length]);
    const prevSlide = useCallback(() => setActiveIndex((prev) => (prev - 1 + media.length) % media.length), [media.length]);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [lightboxOpen, nextSlide, prevSlide]);

    if (!media || media.length === 0) {
        return (
            <div className="aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                Rasm yo'q
            </div>
        );
    }

    const activeMedia = media[activeIndex];

    return (
        <>
            <div className="space-y-4">
                {/* Main image */}
                <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden group max-h-[500px]">
                    {activeMedia.type === 'VIDEO' ? (
                        <video
                            key={activeMedia.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-contain"
                            poster={activeMedia.thumbUrl}
                        >
                            <source src={activeMedia.url} type="video/mp4" />
                        </video>
                    ) : (
                        <Image
                            src={activeMedia.url}
                            alt={`${title} - ${activeIndex + 1}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-contain cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                        />
                    )}

                    {/* Zoom hint icon */}
                    {activeMedia.type === 'IMAGE' && (
                        <button
                            onClick={() => setLightboxOpen(true)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                    )}

                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {media.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIndex(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === activeIndex ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={item.thumbUrl || item.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                    loading="lazy"
                                />
                                {item.type === 'VIDEO' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <Play className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-10 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-7 h-7" />
                    </button>

                    {/* Counter */}
                    {media.length > 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                            {activeIndex + 1} / {media.length}
                        </div>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-full h-full max-w-5xl max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={activeMedia.url}
                            alt={`${title} - ${activeIndex + 1}`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Prev / Next */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-7 h-7" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-7 h-7" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
