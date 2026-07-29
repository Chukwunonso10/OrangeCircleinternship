"use client"

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchForm() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = useDebouncedCallback((term: string) => {
        // Copy the current query string
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }

        // Go back to page 1 whenever a new search is performed
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    }, 200);

    return (
        <div>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    id="search"
                    defaultValue={searchParams.get("search") ?? ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search item"
                    className="w-full rounded-3xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-950 shadow-sm outline-none transition duration-300 focus:border-brand-primary-[#0b7a75] focus:ring-2 focus:ring-[#6DAFAC]/20 focus:shadow-md text-slate-950"
                />
        </div>
    )
}


