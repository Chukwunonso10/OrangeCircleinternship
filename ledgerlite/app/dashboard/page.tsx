import SideNav from "@/components/sideNav";
import UserNav from "@/components/userNav";
import DashboardCard from "@/components/dashboardcard";
import { TrendingUp, TrendingDown, ShoppingBag, Banknote, Plus, Receipt, Package } from "lucide-react";
import prisma from "../lib/prisma";
import { getCurrentUserId } from "../lib/authhelper";
import { redirect } from "next/navigation";
import { getMetrics } from "../lib/metrics";
import Link from "next/link";

interface Profile {
  id: string
  name: string
  buisnessName: string

}

export default async function Dashboard() {
  const userId = await getCurrentUserId()
  if (!userId) redirect("/signin")

  let profile: any;

  profile = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, buisnessName: true } })

  if (!profile) {
    throw new Error("profile not found")
  }

  const { name, buisnessName } = profile

  const metrics = await getMetrics()
  const lowstock = metrics?.lowStock || []

  const [sales, expenses] = await Promise.all([
    prisma.sale.findMany({
      where: { userId },
      include: { item: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ])

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium"})

  const formattedSales = sales.map(sale => ({
    id: sale.id,
    transaction: sale.item?.name || sale.customItemName || "Untracked Sale",
    type: "Sale",
    amount: Number(sale.totalAmount),
    // timestamp: new Date(sale.createdAt).toLocaleString(undefined, {
    //   dateStyle: "medium",
    //   timeStyle: "short",
    // }),
    timestamp:  formatter.format(),
    rawDate: sale.createdAt
  }));

  const formattedExpenses = expenses.map(expense => ({
    id: expense.id,
    transaction: expense.description || expense.category || "General Expense",
    type: "Expense",
    amount: Number(expense.amount),
    timestamp: formatter.format(new Date(expense.createdAt)),
    rawDate: expense.createdAt
  }));

  const recentTransactions = [...formattedSales, ...formattedExpenses]
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 5)
    .map(({ rawDate, ...rest }) => rest);


  return (
    <div>
      {/* imported side navigation routes bar */}
      <div>
        <SideNav />
      </div>
      <div className="ml-0 md:ml-70 sm:ml-0">
        <UserNav name={name} buisnessName={buisnessName} />
      </div>
      <main className="ml-0 md:ml-72 sm:ml-0  p-6">
        {/* heading */}
        <section>
          <div className="space-y-6">
            <div>
              {/*title heading */}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Good morning <span>{name}</span>
              </h1>
              <p className=" text-slate-600 dark:text-slate-400">
                Here’s a quick look at how your business today{" "}
              </p>
            </div>
          </div>
        </section>

        {/* dashboard boxes(insight card) money in, money out, total profit, total sale  */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-5">
            {/* box 3 today's profit */}

            <div className="bg-[#0B7A75] p-5 border border-[#6DAFAC] md:bg-white rounded-lg shadow-sm">
              <div className="bg-[#3a8683] p-2 w-10 md:bg-[#f4f8f8] text-slate-500 rounded-lg">
                <Banknote className="text-white md:text-gray-600" size={18} />
              </div>

              <p className="text-sm font-semibold text-white md:text-slate-500 uppercase tracking-wider mt-3">
                TODAY'S PROFIT
              </p>

              <h3 className="font-bold text-white md:text-[#032523] text-[40px]">
                ₦{Number(metrics?.profitToday || 0).toLocaleString()}{" "}
              </h3>

              <p className="text-xs text-white md:text-slate-500 mt-2">
                yesterday: ₦
                {Number(metrics?.profitYesterday || 0).toLocaleString()}
              </p>
            </div>

            {/* box1 money in */}
            <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm">
              <div className="p-2 w-10 bg-[#e4f5ed] text-[#02ad5e] rounded-lg">
                <TrendingUp size={18} />
              </div>

              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
                MONEY IN
              </p>

              <h3 className="font-bold text-[#032523] text-[40px]">
                ₦{Number(metrics?.TotalMoneyIn || 0).toLocaleString()}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                yesterday: ₦
                {Number(metrics?.moneyInYesterday || 0).toLocaleString()}
              </p>
            </div>

            {/* box 2 money out*/}

            <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm">
              <div className="p-2 w-10 bg-[#f9e6e8] text-[#d01527] rounded-lg ">
                <TrendingDown size={18} />
              </div>

              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
                MONEY OUT
              </p>

              <h3 className="font-bold text-[#032523] text-[40px]">
                ₦{Number(metrics?.totalMoneyOut || 0).toLocaleString()}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                yesterday: ₦
                {Number(metrics?.moneyOutYesterday || 0).toLocaleString()}
              </p>
            </div>

            {/* box 4 total sales today */}

            <div className="p-5 border border-[#6DAFAC] rounded-lg shadow-sm ">
              <div className="p-2 w-10 bg-[#f4f8f8] text-slate-500 rounded-lg">
                <ShoppingBag size={18} />
              </div>

              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-3">
                TOTAL SALES TODAY
              </p>

              <h3 className="font-bold text-[#032523] text-[40px]">
                {Number(
                  metrics?.totalsalescountToday || 0,
                ).toLocaleString()}{" "}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                yesterday:{" "}
                {Number(
                  metrics?.totalSalesCountyesterday || 0,
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="md:flex md:justify-between ">
            <div className="md:border md:border-gray-200 md:shadow-sm px-5 rounded-2xl">
              <p className="p-3">Quick Actions</p>

              <div className="flex justify-between gap-2  md:space-x-5 ">
                {/* action links */}
                <div className="py-2">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl px-9 py-5 sm:p-15 md:p-18  hover:opacity-80"
                    href="/sales"
                  >
                    <ShoppingBag className="space-y-2" size={15} />
                    <span className=" flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Sales
                    </span>
                  </Link>
                </div>
                <div className="py-2">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl p-5 sm:p-15 md:p-18 hover:opacity-80"
                    href="/expense"
                  >
                    <Receipt size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Expense
                    </span>
                  </Link>
                </div>
                <div className="py-2">
                  <Link
                    className="flex flex-col items-center text-white bg-[#0B7A75] rounded-2xl p-5 sm:p-15 md:p-18  hover:opacity-80"
                    href="/inventory"
                  >
                    <Package size={15} />
                    <span className="flex items-center gap-2 py-2 text-xs md:text-sm">
                      <span className="hidden md:block">Add</span> Inventry
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* alert */}
            <div className="md:border flex flex-col md:shadow-sm md:border-gray-200 rounded-2xl my-5">
              <div className="flex justify-between py-4 px-6 ">
                <h4 className="text-sm font-semibold">Low stock</h4>
                <div className="flex  items-center  px-2 bg-red-100 rounded-xl ">
                  <p className=" items-center text-sm text-red-700 ">
                    {metrics?.allLowStockCount + " "} {lowstock.length <= 1 ? "Alert" : "Alerts"}
                  </p>
                </div>
              </div>
              {Array.isArray(lowstock) && lowstock.length !== 0 ? (
                lowstock.map((item: any) => (
                  <div key={item.id} className="flex justify-between gap-5 py-4 px-6 border-b border-gray-100 last:border-0">
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
                      <Link href={`/inventory?search=${encodeURIComponent(item.name)}`} className="text-[#0B7A75] hover:opacity-85">
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
          </div>
        </section>
        {/* transaction history */}
        <section>
          <div className="my-5">
            <DashboardCard dashboard={recentTransactions} />
          </div>
        </section>
      </main>
    </div>
  );
}
