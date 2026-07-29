"use client";
import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import ExpenseForm from "@/components/expenseform";
import ExpenseCard from "@/components/expensecard";
import { ShoppingBag, Search } from "lucide-react";
import SearchForm from "@/components/searchform";

export default function ExpenseClient({moneyOutToday, totalMoneyOut, moneyOutYesterday, expenses}: {moneyOutToday: number,totalMoneyOut: number , moneyOutYesterday: number, expenses: any[]}) {

  return (
    <div>
      <div>
        <div>
          <SideNav />
        </div>
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav />
        </div>
        <main className="ml-0 md:ml-72 sm:ml-10  p-6">
          <div className="border border-gray-300 my-5 shadow-sm p-6 rounded-4xl">
            <div>
              <h2 className="text-[#032523] text-2xl font-bold">Expense</h2>

              <p className="py-2 text-sm text-gray-700">
                Manage your Expenses to your dashboard and view it
                anytime
              </p>
            </div>

            <div className="md:flex justify-between items-center gap-10">
              <div className="relative w-full max-w-lg ">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <SearchForm />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ExpenseForm />
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid  gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="max-w-sm rounded-3xl border border-[#6DAFAC] bg-[#f4faf9] p-6 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75]">
                  <ShoppingBag size={20} />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500">
                  Total expense today
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  ₦{totalMoneyOut.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Yesterday: ₦{moneyOutYesterday.toLocaleString()}
                </p>
              </div>
            </div>
            <aside className=" rounded-4xl my-10 border border-[#6DAFAC] bg-white/95 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">
                Expense history
              </h2>

              <p className="py-3 text-sm text-slate-600">
                Your Expense will appear here once they are saved.
              </p>
              {expenses.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0b7a75]/10 text-[#0b7a75]">
                    <ShoppingBag size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Espense records will appear below
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    When you save an expense, it will appear in this section for
                    quick review.
                  </p>
                  <div>
                    <ExpenseForm />
                  </div>
                </div>
              ) : (
                <div className="py-5">
                  <ExpenseCard expense={expenses} />
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
