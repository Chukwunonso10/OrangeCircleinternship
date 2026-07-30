import React from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { getMetrics } from "@/app/lib/metrics";

export default async function LowStockAlerts() {
  const metrics = await getMetrics();
  const lowstock = metrics?.lowStock || [];
  const count = metrics?.allLowStockCount || 0;

  return (
    <div className="md:border flex flex-col md:shadow-sm md:border-gray-200 rounded-2xl my-5 bg-white w-full md:max-w-md">
      <div className="flex justify-between py-4 px-6 border-b border-gray-50">
        <h4 className="text-sm font-semibold text-slate-800">Low stock</h4>
        <div className="flex items-center px-2 bg-red-100 rounded-xl">
          <p className="items-center text-sm text-red-700">
            {count} {lowstock.length <= 1 ? "Alert" : "Alerts"}
          </p>
        </div>
      </div>
      {Array.isArray(lowstock) && lowstock.length !== 0 ? (
        lowstock.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between gap-5 py-4 px-6 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Package size={15} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                <p className="text-xs text-slate-500">
                  {item.currentStock} units left . Min {item.lowStock}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href={`/inventory?search=${encodeURIComponent(item.name)}`}
                className="text-[#0B7A75] hover:opacity-85"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="py-8 text-center text-sm text-slate-500">
          No low stock alerts at the moment.
        </div>
      )}
    </div>
  );
}
