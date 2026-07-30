import React from "react";
import { TrendingUp, TrendingDown, Banknote, ShoppingBag } from "lucide-react";
import { getMetrics } from "@/app/lib/metrics";

export default async function DashboardMetrics() {
  const metrics = await getMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-5">
      {/* Box 1: Money In */}
      <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm bg-white">
        <div className="p-2 w-10 bg-[#e4f5ed] text-[#02ad5e] rounded-lg">
          <TrendingUp size={18} />
        </div>

        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
          MONEY IN
        </p>

        <h3 className="font-bold text-[#032523] text-[40px] truncate">
          ₦{Number(metrics?.TotalMoneyIn || 0).toLocaleString()}
        </h3>

        <p className="text-xs text-slate-500 mt-2">
          yesterday: ₦
          {Number(metrics?.moneyInYesterday || 0).toLocaleString()}
        </p>
      </div>

      {/* Box 2: Money Out */}
      <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm bg-white">
        <div className="p-2 w-10 bg-[#f9e6e8] text-[#d01527] rounded-lg">
          <TrendingDown size={18} />
        </div>

        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
          MONEY OUT
        </p>

        <h3 className="font-bold text-[#032523] text-[40px] truncate">
          ₦{Number(metrics?.totalMoneyOut || 0).toLocaleString()}
        </h3>

        <p className="text-xs text-slate-500 mt-2">
          yesterday: ₦
          {Number(metrics?.moneyOutYesterday || 0).toLocaleString()}
        </p>
      </div>

      {/* Box 3: Today's Profit */}
      <div className="bg-[#0B7A75] p-5 border border-[#6DAFAC] md:bg-white rounded-lg shadow-sm">
        <div className="bg-[#3a8683] p-2 w-10 md:bg-[#f4f8f8] text-slate-500 rounded-lg">
          <Banknote className="text-white md:text-gray-600" size={18} />
        </div>

        <p className="text-sm font-semibold text-white md:text-slate-500 uppercase tracking-wider mt-3">
          TODAY'S PROFIT
        </p>

        <h3 className="font-bold text-white md:text-[#032523] text-[40px] truncate">
          ₦{Number(metrics?.profitToday || 0).toLocaleString()}
        </h3>

        <p className="text-xs text-white md:text-slate-500 mt-2">
          yesterday: ₦
          {Number(metrics?.profitYesterday || 0).toLocaleString()}
        </p>
      </div>

      {/* Box 4: Total Sales Today */}
      <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm bg-white">
        <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
          <ShoppingBag size={18} />
        </div>

        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
          TOTAL SALES TODAY
        </p>

        <h3 className="font-bold text-[#032523] text-[40px] truncate">
          {Number(metrics?.totalsalescountToday || 0).toLocaleString()}
        </h3>

        <p className="text-xs text-slate-500 mt-2">
          yesterday:{" "}
          {Number(metrics?.totalSalesCountyesterday || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
