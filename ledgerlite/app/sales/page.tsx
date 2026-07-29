import { SalesClient } from "@/components/sales";
import { getMetrics } from "../lib/metrics";
import { getCurrentUserId } from "../lib/authhelper";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";




export default async function Sales({ searchParams }: { searchParams: { [key: string]: string } }) {

  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error("authentication error")
  }

  const metrics = await getMetrics()
  if (!metrics) return null

  const params = await searchParams
  let query: Prisma.SaleWhereInput = {}

  // if (search) {
  //   query.OR = [
  //     {
  //       item: {
  //         name: {
  //           contains: search,
  //           mode: "insensitive"
  //         }
  //       }
  //     },
  //     {
  //       customItemName: {
  //         contains: search,
  //         mode: "insensitive"
  //       }
  //     }
  //   ],

  // }

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                customItemName: {
                  contains: value, mode: "insensitive"
                }
              },

              {
                item: {
                  name: { contains: value, mode: "insensitive" }
                }
              }
            ];
            break
        }
      }
    }
  }

  const page = Number(params?.page ?? 1);
  const pageSize = 5;

  const [totalSales, sales, user ] = await Promise.all([

    prisma.sale.count({
      where: { userId, ...query }
    }),

    prisma.sale.findMany({
      where: { userId, ...query },
      include: {
        item: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize
    }),

    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, buisnessName: true }
    }),



  ])

  const totalPages = Math.ceil(totalSales / pageSize) || 1;


  // Serialize Prisma Decimal and Date objects to plain serializable JS types
  const serializedSales = sales.map(sale => ({
    ...sale,
    unitPrice: Number(sale.unitPrice),
    totalAmount: Number(sale.totalAmount),
    createdAt: sale.createdAt.toISOString(),
    updatedAt: sale.updatedAt.toISOString()
  }))

  const moneyInToday = Number(metrics.moneyinToday)
  const moneyInYesterday = Number(metrics.moneyInYesterday)

  if (!user) {
    throw new Error("user not found")
  }

  return (
    <div>
      <SalesClient
        moneyinToday={moneyInToday}
        moneyInYesterday={moneyInYesterday}
        sales={serializedSales}
        name={user.name}
        buisnessName={user.buisnessName}
        currentPage={page}
        totalPages={totalPages}
        totalSales={totalSales}
        pageSize={pageSize}
      />
    </div>
  )
}