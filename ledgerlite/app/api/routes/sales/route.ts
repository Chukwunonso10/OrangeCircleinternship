import { Prisma } from "@/app/generated/prisma/client";
import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorize!!: pls log in"
            })
        }
        // const {page, ...queryParams} = searchParams
        // let query: Prisma.SaleWhereInput = {}

        // for( const [key, value] of Object.entries(queryParams)){
        //     switch(key){
        //         case "search":
        //             query.item = {name: {contains: value, mode: "insensitive"}} 
        //     }
        // }



        const allSales = await prisma.sale.findMany({
            where: { userId: userId },
        })
        if (allSales.length === 0) {
            return NextResponse.json({
                success: true, message: "No sales currently recorded"
            })
        }

        return NextResponse.json({
            success: true, message: "successfully retrieved all sales", data: allSales.map((each) => ({ ...each }))
        }, { status: 200 })
    } catch (error) {
        console.log("Error retrieving sales log")
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {

        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorized!!, pls log in"
            })
        }
        const { operationId, id, unitPrice, quantity, customItemName, itemId, createdAt } = await req.json()
        const price = Number(unitPrice)
        const qty = Number(quantity)

        if (!qty) {
            return NextResponse.json({
                success: false, message: `quantity is required!`
            }, { status: 400 })
        }
        if (qty <= 0) {
            return NextResponse.json({
                success: false, message: `Bad request: quantity should be greater than 0!`
            }, { status: 400 })
        }
        if (!price) {
            return NextResponse.json({
                success: false, message: `unitprice is required!`
            }, { status: 400 })
        }

        const totalAmount = qty * price

        if (operationId) {
            const processedProduct = await prisma.syncOperation.findUnique({ where: { id: operationId } })

            if (processedProduct) {
                return NextResponse.json({
                    success: false, message: "sales already synced!!"
                }, { status: 200 })
            }
        }

        const cleanedItemId = (itemId && itemId !== "null" && itemId !== "undefined" && String(itemId).trim() !== "") ? itemId : null;
        const cleanedCustomItemName = (customItemName && String(customItemName).trim() !== "") ? customItemName : null;
        const cleanedId = (id && id !== "null" && id !== "undefined" && String(id).trim() !== "") ? id : undefined;

        const parsedDate = (createdAt && !isNaN(Date.parse(createdAt))) ? new Date(createdAt) : undefined;

        const sales = await prisma.$transaction(async (tsx) => {
            //for items that are tracked
            if (cleanedItemId) {
                const isProductExist = await tsx.item.findUnique({ where: { id: cleanedItemId } })

                if (!isProductExist) {
                    throw new Error("product does not exist, create a product first before you can record a sale")
                }

                if (isProductExist.userId !== userId) {
                    throw new Error("Forbidden: you do not own this product!!")
                }

                if (isProductExist.currentStock < qty) {
                    throw new Error(`insufficient stock!!!, Available stock in inventory is ${isProductExist.currentStock}`)
                }

                await tsx.item.update({
                    where: { id: cleanedItemId },
                    data: {
                        currentStock: {
                            decrement: qty
                        }
                    }
                })
            }
            //for items not tracked
            //sell off the item
            const soldItem = await tsx.sale.create({
                data: {
                    id: cleanedId ? cleanedId : undefined,
                    unitPrice: price,
                    quantity: qty,
                    totalAmount,
                    customItemName: cleanedCustomItemName,
                    itemId: itemId ? itemId : null,
                    createdAt: parsedDate,
                    userId
                }
            })

            //log the sync transaction
            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation: "CREATE",
                        resource: "SALE",
                        resourceId: soldItem.id,
                        userId,
                    }
                })
            }
            return soldItem;
        })

        return NextResponse.json({
            success: true, message: "item sold successfully"
        }, { status: 201 })


    } catch (error) {
        console.log("Error: sales couldnt be completed", error)
        return NextResponse.json({
            success: false, message: `internal server error`
        }, { status: 500 })
    }
}

