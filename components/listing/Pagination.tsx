'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    searchParams: Record<string, any>;
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
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
        return `/bozor${queryString ? `?${queryString}` : ''}`;
    };

    // Calculate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Page info */}
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Sahifa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </p>

            {/* Page buttons */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                {currentPage > 1 ? (
                    <Link
                        href={buildUrl(currentPage - 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Page numbers */}
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
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                }`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}

                {/* Next button */}
                {currentPage < totalPages ? (
                    <Link
                        href={buildUrl(currentPage + 1)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-medium bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
