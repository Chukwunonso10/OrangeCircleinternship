import React from "react";
import prisma from "@/app/lib/prisma";
import DashboardCard from "@/components/dashboardcard";

interface RecentTransactionsProps {
  userId: string;
}

export default async function RecentTransactions({ userId }: RecentTransactionsProps) {
  const [sales, expenses] = await Promise.all([
    prisma.sale.findMany({
      where: { userId },
      include: { item: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const formattedSales = sales.map((sale) => ({
    id: sale.id,
    transaction: sale.item?.name || sale.customItemName || "Untracked Sale",
    type: "Sale",
    amount: Number(sale.totalAmount),
    timestamp: formatter.format(new Date(sale.createdAt)),
    rawDate: sale.createdAt,
  }));

  const formattedExpenses = expenses.map((expense) => ({
    id: expense.id,
    transaction: expense.description || expense.category || "General Expense",
    type: "Expense",
    amount: Number(expense.amount),
    timestamp: formatter.format(new Date(expense.createdAt)),
    rawDate: expense.createdAt,
  }));

  const recentTransactions = [...formattedSales, ...formattedExpenses]
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 5)
    .map(({ rawDate, ...rest }) => rest);

  return <DashboardCard dashboard={recentTransactions} />;
}
