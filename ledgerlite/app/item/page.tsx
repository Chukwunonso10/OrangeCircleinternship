import { NextResponse } from "next/server"
import { getCurrentUserId } from "../lib/authhelper"
import prisma from "../lib/prisma"
import ItemForm from "../components/itemForm"
import { redirect } from "next/navigation"

export default async function Item() {
    const userId = await getCurrentUserId()

    if (!userId) {
        redirect("/signin")
    }
    const user = await prisma.user.findUnique({where: {id: userId}})
    const myname = user?.name
    const allItems = await prisma.item.findMany({
        where: { userId },
        take: 1
    })
    if (allItems) {
        console.log(allItems)
    }
    return (
        <div className="text-2xl text-blue-500">
            <h1 className="absolute top-0 right-3">welcome {myname}</h1>
            <h1 className="absolute top-0 right-3"></h1>
            {allItems.map((item) => {
                return (
                    <div key={item.id} className="flex flex-col gap-2 items-center justify-center">
                        <p> id: {item.id}</p>
                        <p> category: {item.name}</p>
                        <p>description: {item.lowStock}</p>
                        <p>description: {item.currentStock}</p>
                        <p>date: {item.createdAt.toDateString()}</p>
                    </div>
                )
            })}

            <ItemForm />

        </div>
    )
}