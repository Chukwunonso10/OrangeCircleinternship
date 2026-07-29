import { getCurrentUserId } from "./authhelper"
import prisma from "./prisma"

export async function getMetrics() {
    const userId = await getCurrentUserId()
    if (!userId) return null

    const now = new Date()
    //todays date 00: 00: 00: 00
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const yesterdayEnd = new Date(todayEnd)
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)

    const [TotalRevenue, TotalExpenses, todayTotalRevenue, todayTotalExpenses, todayTotalSales, yesterdaytotalSales, yesterdaytotalRevenue, yesterdaytotalExpenses, allItems] = await Promise.all([

        prisma.sale.aggregate({
            where: { userId },
            _sum: { totalAmount: true },
        }),

        prisma.expense.aggregate({
            where: { userId },
            _sum: { amount: true },
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { totalAmount: true },
        }),

        prisma.expense.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { amount: true },
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: todayStart, lt: todayEnd } },
            _sum: { totalAmount: true },
            _count: { id: true }
        }),

        prisma.sale.aggregate({
            where: { userId, createdAt: { gt: yesterdayStart, lt: yesterdayEnd } },
            _sum: { totalAmount: true },
            _count: { id: true }
        }),

        prisma.sale.aggregate({
            where: {userId, createdAt: {gt: yesterdayStart, lt: yesterdayEnd}},
            _sum: {totalAmount: true}
        }),

        prisma.expense.aggregate({
            where: {userId, createdAt: {gt: yesterdayStart, lt: yesterdayEnd}},
            _sum: {amount: true}
        }),

        prisma.item.findMany({where: {userId}})
    ])

    const lowStockItems = allItems.filter(item => item.currentStock <= item.lowStock)
    const lowStock = lowStockItems.slice(0, 3)
    const lowStockCount = lowStockItems.length

    const TotalMoneyIn = Number(TotalRevenue._sum.totalAmount) ?? 0
    const totalMoneyOut = Number(TotalExpenses._sum.amount) ?? 0

    const moneyinToday = Number(todayTotalRevenue._sum.totalAmount) ?? 0
    const moneyOutToday = Number(todayTotalExpenses._sum.amount) ?? 0

    const moneyInYesterday = Number(yesterdaytotalRevenue._sum.totalAmount) ?? 0
    const moneyOutYesterday = Number(yesterdaytotalExpenses._sum.amount) ?? 0

    const totalsalescountToday = Number(todayTotalSales._count.id) ?? 0
    const totalSalesCountyesterday = Number(yesterdaytotalSales._count.id) ?? 0

    const profitToday = moneyinToday - moneyOutToday
    const profitYesterday = moneyInYesterday - moneyOutYesterday

    const allLowStockCount = Number(lowStockCount)
   
    

    return {
        TotalMoneyIn,
        totalMoneyOut,
        moneyinToday,
        moneyOutToday,
        moneyInYesterday,
        moneyOutYesterday,
        totalsalescountToday,
        totalSalesCountyesterday,
        profitToday,
        profitYesterday,
        allLowStockCount,
        lowStock


    }
}