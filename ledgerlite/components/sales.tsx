"use client";

import { useOptimistic } from "react";
import dynamic from "next/dynamic";
import SideNav from "@/components/sideNav";
import SalesCard from "@/components/salescard";
import { ReceiptText } from "lucide-react";
import SearchForm from "./searchform";
import UserNav from "./userNav";

// Dynamically import SalesForm to optimize bundle size and hydration
const SalesForm = dynamic(() => import("@/components/salesform"), {
  ssr: false,
  loading: () => (
    <button className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 opacity-70 cursor-wait">
      Loading Form...
    </button>
  ),
});

export function SalesClient({
  moneyinToday,
  moneyInYesterday,
  sales,
  name,
  buisnessName,
  currentPage,
  totalPages,
  totalSales,
  pageSize,
}: {
  moneyinToday: number;
  moneyInYesterday: number;
  sales: any[];
  name: string;
  buisnessName: string;
  currentPage: number;
  totalPages: number;
  totalSales: number;
  pageSize: number;
}) {
  // Optimistic updates for the sales list (add, edit, delete actions)
  const [optimisticSales, dispatchSalesAction] = useOptimistic(
    sales,
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

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav name={name} buisnessName={buisnessName} />
        </div>
        <main className="ml-0 md:ml-72 sm:ml-10 p-6">
          <div className="border border-gray-300 my-5 rounded-4xl p-5 shadow-sm">
            <div>
              <h2 className="text-[#032523] text-2xl font-bold">Sales</h2>

              <p className="py-2 text-sm text-gray-700">
                Manage your Sales in your dashboard and view it anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10 animate-in fade-in slide-in-from-top duration-500">
              <div className="relative w-full max-w-lg transition-all duration-300">
                <SearchForm />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SalesForm
                  onAddOptimistic={(newSale) =>
                    dispatchSalesAction({ type: "add", payload: newSale })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <div className="grid gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC] p-6 shadow-sm transition-all hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900 transition-colors duration-300">
                  ₦{moneyinToday.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: ₦{moneyInYesterday.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Sales history */}
            <aside
              className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg transition-all hover:shadow-xl hover:border-[#0b7a75] animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationFillMode: "both", animationDelay: "200ms" }}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Sales history
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Your sales appears here once they are saved.
              </p>
              {optimisticSales.length === 0 ? (
                <div className="flex flex-col items-center mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0b7a75]/10 text-[#0b7a75]">
                    <ReceiptText size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    No sales records yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    When you save a sale, it will appear in this section for quick
                    review.
                  </p>
                </div>
              ) : (
                <div className="py-5">
                  <SalesCard
                    sales={optimisticSales}
                    onDeleteOptimistic={(id) =>
                      dispatchSalesAction({ type: "delete", payload: id })
                    }
                    onEditOptimistic={(id, data) =>
                      dispatchSalesAction({
                        type: "edit",
                        payload: { id, data },
                      })
                    }
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalSales={totalSales}
                    pageSize={pageSize}
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
