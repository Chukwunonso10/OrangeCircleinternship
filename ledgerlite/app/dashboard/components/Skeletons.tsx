import React from "react";

export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 border border-slate-200 rounded-lg shadow-sm bg-white space-y-4">
          <Shimmer className="h-10 w-10 rounded-lg" />
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-10 w-36" />
          <Shimmer className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function LowStockSkeleton() {
  return (
    <div className="border border-slate-200 shadow-sm rounded-2xl p-6 bg-white w-full md:max-w-md my-5 min-h-[220px]">
      <div className="flex justify-between items-center mb-6">
        <Shimmer className="h-5 w-24" />
        <Shimmer className="h-5 w-16 rounded-xl" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3">
              <Shimmer className="h-9 w-9 rounded-xl" />
              <div className="space-y-2">
                <Shimmer className="h-4 w-28" />
                <Shimmer className="h-3 w-36" />
              </div>
            </div>
            <Shimmer className="h-6 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden my-5">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <Shimmer className="h-5 w-40" />
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
            <Shimmer className="h-5 w-32" />
            <Shimmer className="h-6 w-16 rounded-lg" />
            <Shimmer className="h-5 w-20" />
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
