import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "unauthorized: pls log in to continue"
            }, { status: 401 })
        }


        const allProducts = await prisma.item.findMany({ where: { userId }, orderBy: { createdAt: "asc" } })

        if (allProducts.length === 0) {
            return NextResponse.json({
                success: false, message: "No products found in the database!"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true, message: "successfully retrieved products", allProducts
        }, { status: 200 })

    } catch (error) {
        console.log("Error retrieving items", error)
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
                success: false, message: "unauthorized: pls log in to continue"
            }, { status: 401 })
        }
        const { operationId, id, name, lowStock, currentStock, createdAt } = await req.json()

        if (!name) {
            return NextResponse.json({
                success: false, message: "Bad Request: Name is required!"
            }, { status: 400 })
        }

        const duplicateItem = await prisma.item.findUnique({
            where: { name }
        })
        if (duplicateItem) {
            return NextResponse.json({
                success: false, message: `A product with the name "${name}" already exists.`
            }, { status: 400 })
        }

        if (lowStock <= 0 ||  currentStock <= 0) {
            return NextResponse.json({
                success: false, message: "Bad Request: lowStock or currentStock cannot be negative"
            }, { status: 400 })
        }

        if (operationId) {
            const processedProduct = await prisma.syncOperation.findUnique({ where: { id: operationId } })

            if (processedProduct) {
                return NextResponse.json({
                    success: false, message: "product already synced!!"
                }, { status: 200 })
            }
        }

        const productItem = await prisma.$transaction(async (tsx) => {
            let operation;
            let createdOrUpdated;

            if (id) {
                const existingProduct = await tsx.item.findUnique({ where: { id } })
                if (existingProduct) {
                    //checking for ownership
                    if (existingProduct.userId !== userId) {
                        throw new Error("Forbidden: You do not own this product")
                    }

                    createdOrUpdated = await tsx.item.update({
                        where: { id },
                        data: {
                            name,
                            lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                            currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                            createdAt: createdAt ? new Date(createdAt) : undefined
                        }
                    })
                    operation = "UPDATE"
                } else {
                    createdOrUpdated = await tsx.item.create({
                        data: {
                            id,
                            name,
                            lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                            currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                            userId,
                            createdAt: createdAt ? new Date(createdAt) : undefined
                        }
                    })

                    operation = "CREATE"
                }

            } else {
                createdOrUpdated = await tsx.item.create({
                    data: {
                        name,
                        lowStock: lowStock !== undefined ? Number(lowStock) : undefined,
                        currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
                        userId,
                        createdAt: createdAt ? new Date(createdAt) : undefined
                    }
                })
                operation = "CREATE"
            }

            //logging the operation
            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        resource: "ITEM",
                        resourceId: createdOrUpdated.id,
                        userId,
                        operation
                    }
                })
            }

            return createdOrUpdated;
        })

        return NextResponse.json({
            success: true, message: "product created successfully", productItem
        }, { status: 201 })
    } catch (error) {
        console.error("Failed to create product", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}

















