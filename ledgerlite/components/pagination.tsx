"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number
}

export default function Pagination({ currentPage, totalPages, pageSize }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function handlePageChange(pageNumber: number) {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageNumber));
        
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    function getPageNumbers(current: number, total: number) {
        const pages: (number | string)[] = [];
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (current > 3) {
                pages.push("...");
            }
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (current < total - 2) {
                pages.push("...");
            }
            pages.push(total);
        }
        return pages;
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${isPending ? "opacity-70 pointer-events-none" : ""}`}>
            <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                title="Previous page"
            >
                <ChevronLeft size={14} />
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, index) => {
                if (page === "...") {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-sm select-none font-medium">
                            ...
                        </span>
                    );
                }

                const pageIndex = Number(page);
                const isCurrent = pageIndex === currentPage;

                return (
                    <button
                        key={`page-${pageIndex}`}
                        type="button"
                        onClick={() => handlePageChange(pageIndex)}
                        disabled={isPending}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-semibold transition cursor-pointer ${
                            isCurrent
                                ? "bg-[#0b7a75] text-white border-[#0b7a75]"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={`Page ${pageIndex}`}
                    >
                        {pageIndex}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                title="Next page"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
}