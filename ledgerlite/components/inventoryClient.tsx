"use client";

import { useState, useOptimistic } from "react";
import dynamic from "next/dynamic";
import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import InventoryCard from "@/components/inventorycard";
import InventoryDisplay from "@/components/inventorydisplay";
import { Package, Search, TriangleAlert } from "lucide-react";

// Dynamically import InventoryForm
const InventoryForm = dynamic(() => import("@/components/inventoryform"), {
  ssr: false,
  loading: () => (
    <button className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-sm opacity-75 cursor-wait">
      Loading Form...
    </button>
  ),
});

interface Item {
  id: string;
  name: string;
  lowStock: number;
  currentStock: number;
  createdAt: string;
}

export default function InventoryClient({ initialItems }: { initialItems: Item[] }) {
  const [search, setSearch] = useState("");

  // useOptimistic for immediate UI state feedback on actions
  const [optimisticItems, dispatchInventoryAction] = useOptimistic(
    initialItems,
    (state, action: { type: "add" | "delete" | "edit"; payload: any }) => {
      switch (action.type) {
        case "add":
          return [action.payload, ...state];
        case "delete":
          return state.filter((item) => item.id !== action.payload);
        case "edit":
          return state.map((item) =>
            item.id === action.payload.id
              ? { ...item, ...action.payload.data }
              : item
          );
        default:
          return state;
      }
    }
  );

  const filteredItems = optimisticItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = optimisticItems.filter(
    (item) => item.currentStock <= item.lowStock
  );

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-0 md:ml-72 sm:ml-10 p-6">
          <div className="border border-gray-300 my-5 shadow-sm p-6 rounded-4xl bg-white">
            <div>
              <h2 className="text-[#032523] text-2xl font-bold">Inventory</h2>
              <p className="py-2 text-sm text-gray-700">
                Manage your Inventory in your dashboard and view it anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10">
              <div className="relative w-full max-w-lg">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item"
                  className="w-full rounded-3xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-[#6DAFAC]/6"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <InventoryForm
                  onAddOptimistic={(newItem) =>
                    dispatchInventoryAction({ type: "add", payload: newItem })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="flex flex-col max-w-sm rounded-3xl border border-[#6DAFAC] p-6 shadow-sm bg-white mb-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-brand-primary">
                    <TriangleAlert className="text-red-500" size={20} />
                  </div>
                  <p className="text-sm font-semibold text-slate-950">Low stock alert</p>
                </div>
                <p
                  className={`mt-3 text-lg font-semibold ${
                    lowStockItems.length > 0 ? "text-red-600" : "text-slate-900"
                  }`}
                >
                  {lowStockItems.length > 0
                    ? `${lowStockItems.length} Low Stock Alert${
                        lowStockItems.length > 1 ? "s" : ""
                      }`
                    : "No low stocks"}
                </p>
                <span>
                  <InventoryDisplay lowStockItems={lowStockItems} />
                </span>
              </div>
            </div>

            <aside className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">
                Inventory history
              </h2>
              <p className="py-3 text-sm text-slate-600">
                Your Inventory will appear here once they are saved.
              </p>

              {optimisticItems.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-primary/10 text-brand-primary">
                    <Package size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Inventory records will appear below
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    When you save an inventory item, it will appear in this section for
                    quick review.
                  </p>
                </div>
              ) : (
                <div className="py-5">
                  <InventoryCard
                    items={filteredItems}
                    onDeleteOptimistic={(id) =>
                      dispatchInventoryAction({ type: "delete", payload: id })
                    }
                    onEditOptimistic={(id, data) =>
                      dispatchInventoryAction({
                        type: "edit",
                        payload: { id, data },
                      })
                    }
                  />
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
