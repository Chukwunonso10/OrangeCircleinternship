import ExpenseClient from "@/components/expenses/expenseClient";
import { getMetrics } from "../lib/metrics";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";

export default async function Expense() {
  const userId = await getCurrentUserId()
  if(!userId) {
    redirect("/signin")
  }

  const metrics = await getMetrics()
  if(!metrics) {
    return null
  }
  const { moneyOutToday, totalMoneyOut , moneyOutYesterday, } = metrics
  
  const allExpenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })

  const serializedExpenses = allExpenses.map(exp => ({
    ...exp,
    amount: Number(exp.amount),
    createdAt: exp.createdAt.toISOString(),
    updatedAt: exp.updatedAt.toISOString()
  }))

  return (
    <ExpenseClient  moneyOutToday={moneyOutToday} totalMoneyOut={totalMoneyOut} moneyOutYesterday={moneyOutYesterday} expenses={serializedExpenses}/>
  );
}
