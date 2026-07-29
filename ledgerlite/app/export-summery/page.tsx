"use client"

import { useMemo } from "react";
import { Download, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";

export default function ExportSummary() {
  const totalSales = 24800;
  const totalExpense = 9200;
  const totalProfit = useMemo(() => totalSales - totalExpense, [totalSales, totalExpense]);

  const summaryItems = [
    {
      label: "Total sales",
      value: `$${totalSales.toLocaleString()}`,
      icon: <ArrowUpRight className="h-5 w-5 text-[#0b7a75]" />,
    },
    {
      label: "Total expense",
      value: `$${totalExpense.toLocaleString()}`,
      icon: <ArrowDownRight className="h-5 w-5 text-[#0b7a75]" />,
    },
    {
      label: "Total profit",
      value: `$${totalProfit.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5 text-[#0b7a75]" />,
    },
  ];

 

  return (
    <div>
      <div>
        <SideNav />
        <div className="ml-0 md:ml-70 sm:ml-0">
          <UserNav />
        </div>

        <main className="min-h-screen ml-0 md:ml-72 p-6 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-8">
            <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0b7a75]">
                    Export summary
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                    Sales, expense, and profit at a glance
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Build and download your latest export summary with one click. The PDF includes totals and a clean report layout.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-full bg-[#0b7a75] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0b7a75]/20 transition hover:bg-[#0a6f68] focus:outline-none focus:ring-2 focus:ring-[#0b7a75]/40 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              {summaryItems.map((item:any) => (
                <article
                  key={item.label}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b7a75]/10 text-[#0b7a75]">
                    {item.icon}
                  </div>
                  <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</p>
                </article>
              ))}
            </section>

            <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="md:flex md:items-center md:justify-between md:gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Details</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    The exported PDF report will summarize your financial performance in a clean and professional format.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#0b7a75]/10 px-4 py-2 text-sm font-medium text-[#0b7a75]">
                  Ready to export
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-4xl bg-[#0b7a75]/5 p-5">
                  <p className="text-sm text-[#0b7a75]">Margin</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{((totalProfit / totalSales) * 100).toFixed(1)}%</p>
                </div>
                <div className="rounded-4xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">How it works</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Click the button above to export the summary as a PDF file. Use the file to share performance directly with your team.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
