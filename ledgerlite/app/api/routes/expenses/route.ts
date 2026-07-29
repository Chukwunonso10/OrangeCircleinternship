import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "unauthorized: pls log in"
            })
        }
        const allExpenses = await prisma.expense.findMany({ where: { userId: userId }, orderBy: { createdAt: "asc" } })

        if (allExpenses.length === 0) {
            return NextResponse.json({
                success: true, message: "No expenses recorded currently"
            }, { status: 200 })
        }

        return NextResponse.json({
            success: true, message: "expenses Record Retrieved successfully!", allExpenses
        }, { status: 200 })
    } catch (error) {
        console.error("Error retrieving expenses", error)
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
                success: false, message: "unauthorized: pls log in"
            }, { status: 401 })
        }
        const { operationId, id, amount, category, description, createdAt } = await req.json()

        if (!amount || !category) {
            return NextResponse.json({
                success: false, message: "Enter an expense amount or category"
            }, { status: 400 })
        }

        if (amount <= 1) {
            return NextResponse.json({
                success: false, message: "Enter a valid expense amount"
            }, { status: 400 })
        }

        if (operationId) {
            const processedExpenses = await prisma.syncOperation.findUnique({
                where: { id: operationId }
            })

            if (processedExpenses) {
                return NextResponse.json({
                    success: true, message: "already synced"
                }, { status: 200 })
            }
        }


        const Expenses = await prisma.$transaction(async (tsx) => {
            let createdOrUpdated;
            let operation;
            if (id) {
                const completedExpense = await prisma.expense.findUnique({ where: { id } })

                if (completedExpense) {
                    if (completedExpense.userId !== userId) {
                        throw new Error("Forbidden! you do not own this product")
                    }

                    createdOrUpdated = await tsx.expense.update({
                        where: { id },
                        data: {
                            amount: Number(amount),
                            description: description || null,
                            category,
                            userId,
                            createdAt: createdAt ? new Date(createdAt) : undefined
                        }
                    })
                    operation = "UPDATE"
                } else {
                    createdOrUpdated = await tsx.expense.create({
                        data: {
                            id: id,
                            amount: Number(amount),
                            description: description || null,
                            category,
                            userId,
                            createdAt: createdAt ? new Date(createdAt) : undefined
                        }
                    })

                    operation = "CREATE"
                }
            } else {
                createdOrUpdated = await tsx.expense.create({
                    data: {
                        amount: Number(amount),
                        description: description || null,
                        category,
                        userId,
                        createdAt: createdAt ? new Date(createdAt) : undefined
                    }
                })
                operation = "CREATE"
            }

            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation,
                        resource: "EXPENSE",
                        resourceId: createdOrUpdated.id,
                        userId
                    }
                })
            }

            return createdOrUpdated;
        })

        return NextResponse.json({
            success: true, message: "expenses recorded successfully",
        }, { status: 201 })
    } catch (error) {
        console.log("failed to record expenses", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}
