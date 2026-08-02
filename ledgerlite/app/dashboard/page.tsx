import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Receipt, Package } from "lucide-react";
import { Suspense } from "react";
import DashboardMetrics from "./components/DashboardMetrics";
import LowStockAlerts from "./components/LowStockAlerts";
import RecentTransactions from "./components/RecentTransactions";
import { MetricsSkeleton, LowStockSkeleton, TransactionsSkeleton } from "./components/Skeletons";
import BarChart from "@/components/barchart";

export default async function Dashboard() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/signin");

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, buisnessName: true },
  });

  if (!profile) {
    throw new Error("profile not found");
  }

  const { name, buisnessName } = profile;

  return (
    <div>
      {/* Sidebar navigation */}
      <div>
        <SideNav />
      </div>
      <div className="ml-0 md:ml-70 sm:ml-0">
        <UserNav name={name} buisnessName={buisnessName} />
      </div>

      <main className="ml-0 md:ml-72 sm:ml-0 p-6">
        {/* Good morning heading */}
        <section>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Good morning <span>{name}</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here’s a quick look at how your business today
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard boxes (insight metrics) - Streamed with Suspense */}
        <section>
          <Suspense fallback={<MetricsSkeleton />}>
            <DashboardMetrics />
          </Suspense>
        </section>

        {/* Quick Actions and Alerts */}
        <section>
          <div className="md:flex md:justify-between items-start gap-6">
            {/* Quick Actions */}
            <div className="md:border md:border-gray-200 md:shadow-sm px-5 rounded-2xl bg-white flex-1 py-4">
              <p className="p-3 font-semibold text-sm text-slate-700">Quick Actions</p>

              <div className="flex justify-between gap-2 md:space-x-5">
                <div className="py-2 flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4 py-5 hover:opacity-80 transition duration-150"
                    href="/sales"
                  >
                    <ShoppingBag className="space-y-2" size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Sales
                    </span>
                  </Link>
                </div>
                <div className="py-2 flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4 py-5 hover:opacity-80 transition duration-150"
                    href="/expense"
                  >
                    <Receipt size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Expense
                    </span>
                  </Link>
                </div>
                <div className="py-2 flex-1">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-4 py-5 hover:opacity-80 transition duration-150"
                    href="/inventory"
                  >
                    <Package size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Inventory
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Low stock alerts - Streamed with Suspense */}
            <Suspense fallback={<LowStockSkeleton />}>
              <LowStockAlerts />
            </Suspense>
          </div>
          <BarChart />
        </section>

        {/* Transaction history - Streamed with Suspense */}
        <section>
          <div className="my-5 mt-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Transactions</h2>
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactions userId={userId} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
