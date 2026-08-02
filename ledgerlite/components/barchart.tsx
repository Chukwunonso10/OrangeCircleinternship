import { getCurrentUser } from "@/app/lib/authhelper";
import BarChartClient from "./barchartclient";
import { redirect } from "next/navigation";
import { getMetrics } from "@/app/lib/metrics";
import prisma from "@/app/lib/prisma";

export default async function BarChart() {
    const user = await getCurrentUser()
    if(!user){
        redirect("/signin")
    }

    const [sales , expenses ] = await Promise.all([
        prisma.sale.findMany({where: {userId: user.id}, select:{totalAmount: true}}),
        prisma.expense.findMany({where: {userId: user.id}, select:{amount: true}})
    ])

    const newsales = (sales.map((sale)=> Number(sale.totalAmount)))
    const newexpense = (expenses.map((sale)=> Number(sale.amount)))
    console.log("sales:",newsales, "expenses:",newexpense)

    return (
        <div>
            <BarChartClient inflow={newsales} outflow={newexpense}/>
        </div>
    )
}
