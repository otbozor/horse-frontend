'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, any>;
    basePath?: string;
}

export function AdminPagination({ currentPage, totalPages, searchParams, basePath = '/admin/listings' }: AdminPaginationProps) {
    // Build URL with current filters
    const buildUrl = (page: number) => {
        const params = new URLSearchParams();

        // Add all existing search params except page
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key !== 'page' && value) {
                params.append(key, String(value));
            }
        });

        // Add new page
        if (page > 1) {
            params.append('page', String(page));
        }

        const queryString = params.toString();
        return `${basePath}${queryString ? `?${queryString}` : ''}`;
    };

    // Calculate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
                Sahifa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                    <Link
                        href={buildUrl(currentPage - 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-10 h-10 flex items-center justify-center text-slate-400"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={buildUrl(pageNum)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}

                {currentPage < totalPages ? (
                    <Link
                        href={buildUrl(currentPage + 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
