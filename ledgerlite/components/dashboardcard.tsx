import { Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface DashboardItem {
  id: string;
  transaction: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface DashboardCardProps {
  dashboard?: DashboardItem[];
}

export default function DashboardCard({ dashboard = [] }: DashboardCardProps) {
  const displayDashboard = dashboard;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayDashboard.map((item) => {
              const isSale = item.type.toLowerCase() === "sale" || item.type.toLowerCase() === "sales";
              
              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {item.transaction}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-semibold ${
                      isSale
                        ? "bg-[#e4f5ed] text-[#02ad5e]"
                        : "bg-[#f9e6e8] text-[#d01527]"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-bold ${
                      isSale ? "text-[#02ad5e]" : "text-[#d01527]"
                    }`}>
                      {isSale ? "+" : "-"}₦{item.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-0 py-4">
                    <p className="text-xs text-slate-500">{item.timestamp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={isSale ? "/sales" : "/expense"}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-brand-primary/5 hover:text-brand-primary"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displayDashboard.length === 0 && (
        <div className="flex items-center justify-center px-6 py-12">
          <p className="text-sm text-slate-500">No transaction records found.</p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
        <p className="text-slate-500">
          Showing last 5 transactions
        </p>
        <div className="flex gap-4">
          <Link href="/sales" className="text-[#0B7A75] font-semibold hover:underline">
            View All Sales
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/expense" className="text-[#0B7A75] font-semibold hover:underline">
            View All Expenses
          </Link>
        </div>
      </div>
    </div>
  );
}