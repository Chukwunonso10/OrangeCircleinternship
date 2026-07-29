import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ expenseId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorized!!, pls log in"
            }, { status: 401 })
        }
        const { operationId, amount, description, category, createdAt } = await req.json()
        const { expenseId } = await params

        if (operationId) {
            const processedUpdate = await prisma.syncOperation.findUnique({ where: { id: operationId } })

            if (processedUpdate) {
                return NextResponse.json({
                    success: false, message: "already synced"
                }, { status: 200 })
            }

        }

        const targetexpenses = await prisma.expense.findUnique({
            where: { id: expenseId }
        })

        if (!targetexpenses) {
            return NextResponse.json({
                success: false, message: "Expenses not found!"
            }, { status: 404 })
        }

        if (targetexpenses.userId !== userId) {
            return NextResponse.json({
                success: false, message: "Forbidden: you do not own this expenses"
            }, { status: 403 })
        }

        const updatedExpense = await prisma.$transaction(async (tsx) => {
            const updated = await tsx.expense.update({
                where: { id: expenseId },
                data: {
                    amount: amount ? Number(amount) : undefined,
                    description: description ? description : undefined,
                    category,
                    createdAt: createdAt ? new Date(createdAt) : undefined,
                    userId
                }
            })

            if (operationId) {
                await tsx.syncOperation.create({
                    data: {
                        id: operationId,
                        operation: "UPDATE",
                        resource: "EXPENSE",
                        resourceId: updated.id,
                        userId
                    }
                })
            }

            return updated;
        })

        return NextResponse.json({
            success: true, message: "Expenses updated successfully",updatedExpense
        },{status: 200})



    } catch (error) {
        console.error("Error updating fields", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}







export async function DELETE(req: NextRequest, { params }: { params: Promise<{ expenseId: string }> }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({
                success: false, message: "Unauthorized!!, pls log in"
            }, { status: 401 })
        }

        const { expenseId } = await params
        let body: any = {};
        try {
            body = await req.json();
        } catch (e) {}
        const { operationId } = body

        if(operationId){
            const processedDelete = await prisma.syncOperation.findUnique({where:{id:operationId}})

            if(processedDelete){
                return NextResponse.json({success:true, message:"already synced"}, {status: 200})
            }
        }

        const deletedExpense = await prisma.expense.findUnique({
            where:{id: expenseId}
        })

        if(!deletedExpense){
            return NextResponse.json({
                success: false, message:"This Expenses has Aready been deleted"
            })
        }

        if(deletedExpense.userId !== userId){
            return NextResponse.json({
                success: false, message:"Forbidden: You do not own this expenses"
            })
        }

        const deleted = await prisma.$transaction(async (tsx)=>{
            const deletedRecord = await tsx.expense.delete({where: {id: expenseId}})

            if (operationId) {
                await tsx.syncOperation.create({
                    data:{
                        id: operationId,
                        operation:"DELETE",
                        resource: "EXPENSE",
                        resourceId:deletedRecord.id,
                        userId
                    }
                })
            }

            return deletedRecord
        })

        return NextResponse.json({
            success: true, message: "Expenses Deleted successfully",deleted
        }, { status: 200 })

    } catch (error) {
        console.error("Error Deleting fields", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}