import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ salesId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorized!!, pls log in"
            })
        }

        const { operationId, unitPrice, quantity, customItemName, itemId } = await req.json()
        const { salesId } = await params


        if (operationId) {
            const processedEdit = await prisma.syncOperation.findUnique({
                where: { id: operationId }
            })
            if (processedEdit) {
                return NextResponse.json({
                    success: true, message: "already sync"
                }, { status: 200 })
            }
        }

        const oldSale = await prisma.sale.findUnique({ where: { id: salesId } })
        if (!oldSale) {
            return NextResponse.json({
                success: false, message: "sales record was not found"
            }, { status: 404 })
        }

        if (oldSale.userId !== userId) {
            return NextResponse.json({
                success: false, message: "Forbidden!!!: you do not own this sales "
            }, { status: 403 })

        }

        const newQuantity = quantity !== undefined ? Number(quantity) : oldSale.quantity
        const newPrice = unitPrice !== undefined ? Number(unitPrice) : Number(oldSale.unitPrice)


        if (newQuantity < 0) {
            return NextResponse.json({
                success: false, message: "Bad Request: quantity must be greater than 0!"
            }, { status: 400 })
        }

        if (newPrice < 0) {
            return NextResponse.json({
                success: false, message: "Bad Request: price must be greater than 0!"
            }, { status: 400 })
        }

        const totalAmount = newPrice * newQuantity

        const editedSales = await prisma.$transaction(async (tsx) => {
            if (itemId && itemId === oldSale.itemId) {
                const delta = newQuantity - oldSale.quantity
                //checking to know whether to increment or decrement
                if (delta > 0) {
                    const item = await tsx.item.findUnique({ where: { id: itemId } })
                    if (!item) { throw new Error("product does not exist") }

                    if (item.userId !== userId) { throw new Error("Forbidden!! you do not own this product") }

                    if (item.currentStock < delta) { throw new Error(`insufficient stock, The available stock is ${item.currentStock}`) }

                    await tsx.item.update({
                        where: { id: itemId },
                        data: {
                            currentStock: { decrement: delta }
                        }
                    })
                } else if (delta < 0) {
                    const absDelta = Math.abs(delta)
                    await tsx.item.update({
                        where: { id: itemId },
                        data: {
                            currentStock: { increment: absDelta }
                        }
                    })
                }
                //if product has changed
            } else {
                if (oldSale.itemId) {
                    await tsx.item.update({
                        where: { id: oldSale.itemId },
                        data: { currentStock: { increment: oldSale.quantity } }
                    })
                }

                if (itemId) {
                    const newItem = await tsx.item.findUnique({ where: { id: itemId } })
                    if (!newItem) { throw new Error("product not found!") }
                    if (newItem.userId !== userId) { throw new Error("Forbidden: you do not have ownership of this product") }

                    if (newItem.currentStock < newQuantity) {
                        throw new Error(`insufficient stock, The available stock is ${newItem.currentStock}`)
                    }

                    await tsx.item.update({
                        where: { id: newItem.id },
                        data: {
                            currentStock: { decrement: newQuantity }
                        }
                    })
                }
            }

            const updated = await tsx.sale.update({
                where: { id: salesId },
                data: {
                    itemId: itemId ?? oldSale.itemId,
                    unitPrice: newPrice,
                    quantity: newQuantity,
                    totalAmount,
                    customItemName: customItemName ?? oldSale.customItemName

                }
            })

            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation: "UPDATE",
                        resource: "SALE",
                        resourceId: updated.id,
                        userId
                    }
                })
            }

            return updated;

        })
        return NextResponse.json({
            success: false, message: "successfully updated sales"
        }, { status: 200 })

    } catch (error) {
        console.error("failed to update sales", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}





export async function DELETE(req: NextRequest, { params }: { params: Promise<{ salesId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorize!!: pls log in"
            })
        }

        const { salesId } = await params
        let body: any = {};

        try {
            body = await req.json();
        } catch (e) { }

        const { operationId } = body

        if (operationId) {
            const processedSales = await prisma.syncOperation.findUnique({
                where: { id: operationId }

            })
            if (processedSales) {
                return NextResponse.json({
                    success: true, message: "already synced!!"
                }, { status: 200 })
            }
        }

        const deletedSales = await prisma.sale.findUnique({ where: { id: salesId } })
        if (!deletedSales) {
            return NextResponse.json({
                success: false, message: "sales already deleted"
            }, { status: 200 })
        }

        if (deletedSales.userId !== userId) {
            return NextResponse.json({
                success: false, message: "Forbidden: you do not own this product!!"
            })
        }

        const deleted = await prisma.$transaction(async (tsx) => {
            if (deletedSales.itemId) {
                await tsx.item.update({
                    where: { id: deletedSales.itemId },
                    data: {
                        currentStock: { increment: deletedSales.quantity }
                    }
                })
            }

            await tsx.sale.delete({ where: { id: deletedSales.id } })

            //log sync operation
            if (operationId) {
                await tsx.syncOperation.update({
                    where: { id: operationId },
                    data: {
                        operation: "DELETE",
                        resource: "SALE",
                        resourceId: deletedSales.id,
                        userId,
                    }
                })

            }
            return deletedSales;

        })
        return NextResponse.json({
            success: true, message: "Deleted sales record successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("database Error: Failed to Deleted sales record", error)
        return NextResponse.json({
            success: false, message: "internal serve error"
        }, { status: 500 })
    }
}