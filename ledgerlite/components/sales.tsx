"use client"

import SideNav from "@/components/sideNav";
import SalesForm from "@/components/salesform";
import SalesCard from "@/components/salescard";
import { Search, Banknote, ReceiptText } from "lucide-react";
import SearchForm from "./searchform";
import UserNav from "./userNav";
import Pagination from "./pagination";
import { Suspense } from "react";

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
  pageSize: number
}) {
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
                Manage your Sales in your dashboard and view it
                anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10 animate-in fade-in slide-in-from-top duration-500">
              <div className="relative w-full max-w-lg transition-all duration-300">
                <SearchForm />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SalesForm />
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid  gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
              <div
                className="max-w-sm rounded-3xl border border-[#6DAFAC]  p-6 shadow-sm transition-all  hover:shadow-md hover:border-[#0b7a75] animate-in fade-in slide-in-from-left duration-500"
                style={{ animationFillMode: "both", animationDelay: "100ms" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75] transition-transform duration-300 hover:scale-110">
                  <ReceiptText size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 ">
                  Total sales today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900  transition-colors duration-300">
                  ₦{moneyinToday.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Yesterday: ₦{moneyInYesterday.toLocaleString()}
                </p>
              </div>

            </div>
            {/* sales. history */}
            <aside
              className="rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg transition-all  hover:shadow-xl hover:border-[#0b7a75] animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationFillMode: "both", animationDelay: "200ms" }}
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Sales history
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Your sales appears here once they are saved.
              </p>
              {sales.length === 0 ? (
                <div className="flex flex-col items-center mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0b7a75]/10 text-[#0b7a75]">
                    <ReceiptText size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 ">
                    No sales records yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    When you save a sale, it will appear in this section for quick
                    review.
                  </p>
                </div>
              ) : (

                <div className="py-5">
                  
                  <Suspense fallback={<div>Loading sales...</div>}>
                  <SalesCard
                    sales={sales}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalSales={totalSales}
                    pageSize={pageSize}
                  />
                   </Suspense>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
