"use client";
import { useState } from "react";
import { X, Eye } from "lucide-react";

interface Item {
  id: string;
  name: string;
  lowStock: number;
  currentStock: number;
}

interface InventoryDisplayProps {
  lowStockItems?: Item[];
}

export default function InventoryDisplay({ lowStockItems = [] }: InventoryDisplayProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 py-6">
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-2 md:px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        >
          <Eye size={18} />
          <span className="px-1">View</span>
          Alerts
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 "
            style={{ animation: "modal-enter 240ms ease-out forwards" }}
          >
            <div className="transform rounded-3xl transition duration-300 ease-out scale-100 opacity-100">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-xl font-semibold py-2">Low Stock Alerts</h2>
                  <div className="flex items-center py-1 px-4 bg-red-100 rounded-xl w-fit">
                    <p className="items-center text-sm text-red-700 font-semibold">
                      {lowStockItems.length} Alert{lowStockItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* alert list */}
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {lowStockItems.length === 0 ? (
                  <div className="py-8 px-6 text-center text-sm text-slate-500">
                    No low stock items. All products are well stocked!
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-6 py-4 px-6 transition hover:bg-slate-50">
                      <div className="flex items-center px-3 py-1 bg-red-100 rounded-lg shrink-0">
                        <p className="text-xs text-red-700 font-semibold uppercase">
                          low stock
                        </p>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {item.currentStock} units left (threshold is {item.lowStock})
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
