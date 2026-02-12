'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

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

    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % media.length);
    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + media.length) % media.length);

    if (!media || media.length === 0) {
        return (
            <div className="aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                Rasm yo'q
            </div>
        );
    }

    const activeMedia = media[activeIndex];

    return (
        <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden group max-h-[500px]">
                {activeMedia.type === 'VIDEO' ? (
                    <video
                        src={activeMedia.url}
                        controls
                        className="w-full h-full object-contain"
                        poster={activeMedia.thumbUrl}
                    />
                ) : (
                    <img
                        src={activeMedia.url}
                        alt={`${title} - ${activeIndex + 1}`}
                        className="w-full h-full object-contain"
                    />
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
                            <img
                                src={item.thumbUrl || item.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
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
    );
}
