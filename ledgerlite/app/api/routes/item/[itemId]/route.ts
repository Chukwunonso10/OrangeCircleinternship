import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "unauthorized: pls log in"
            })
        }

        const { itemId } = await params
        const { operationId, name, lowStock, currentStock } = await req.json()


        if (!name) {
            return NextResponse.json({
                success: false, message: "Bad Request: Update fields cannot be empty"
            }, { status: 400 })
        }

        if (lowStock <= 0 || currentStock <= 0) {
            return NextResponse.json({
                success: false, message: "Bad Request: lowStock or currentStock cannot be negative"
            }, { status: 400 })
        }

        if (operationId) {
            const processedUpdate = await prisma.syncOperation.findUnique({ where: { id: operationId } })

            if (processedUpdate) {
                return NextResponse.json({
                    success: false, message: "product update already synced!!"
                }, { status: 200 })
            }
        }

        const updatedItem = await prisma.item.findUnique({ where: { id: itemId } })
        if (!updatedItem) {
            return NextResponse.json({
                success: false, message: "Product Not found!"
            }, { status: 404 })
        }
        //check for ownership
        if (updatedItem.userId !== userId) {
            return NextResponse.json({
                success: false, message: "Forbidden: you do not own this product"
            }, { status: 403 })
        }

        const updatedProduct = await prisma.$transaction(async (tsx) => {
            const updated = await tsx.item.update({
                where: { id: itemId },
                data: {
                    name: name !== undefined ? name.trim() : undefined,
                    lowStock: lowStock ? Number(lowStock) : undefined,
                    currentStock: currentStock ? Number(currentStock) : undefined,
                }
            })

            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation: "UPDATE",
                        resource: "ITEM",
                        resourceId: updated.id,
                        userId
                    }
                })
            }

            return updated;
        })

        return NextResponse.json({
            success: true, message: "successfully updated item", updatedProduct
        }, { status: 200 })
    }
    catch (error) {
        console.error("failed to update items")
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "unauthorized: pls log in"
            })
        }
        const { itemId } = await params
        let body: any = {};
        try {
            body = await req.json();
        } catch (e) {}
        const { operationId } = body

        if (operationId) {
            const alreadyProcessed = await prisma.syncOperation.findUnique({
                where: { id: operationId }
            })

            if (alreadyProcessed) {
                return NextResponse.json({
                    success: true, message: "Already synced!!"
                }, { status: 200 })
            }
        }

        const itemExist = await prisma.item.findUnique({
            where: { id: itemId }
        })

        if (!itemExist) {
            return NextResponse.json({
                success: false, message: "product does not exist"
            }, { status: 404 })
        }

        //check for ownership
        if (itemExist.userId !== userId) {
            return NextResponse.json({
                success: false, message: "Forbidden: you do not own this product"
            }, { status: 403 })
        }

        const deleted = await prisma.$transaction(async (tsx) => {
            const deletedItem = await tsx.item.delete({ where: { id: itemId } })

            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation: "DELETE",
                        resource: "ITEM",
                        resourceId: deletedItem.id,
                        userId,
                    }
                })
            }

            return deletedItem;

        })

        return NextResponse.json({
            success: true, message: "successfully deleted item", deleted
        }, { status: 200 })

    } catch (error) {
        console.error("failed to deleted items")
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}