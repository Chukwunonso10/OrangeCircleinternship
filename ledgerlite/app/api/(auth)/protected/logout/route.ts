import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const cookiesStore = await cookies()
        const sessionToken = cookiesStore.get("sessionToken")?.value

        if (sessionToken) {
            try {
                // deleteMany is safe and does not throw an error if the token has already been deleted or expired
                await prisma.session.deleteMany({ where: { sessionToken } })
            } catch (dbError) {
                console.error("Failed to delete session token in DB:", dbError)
            }
        }

        // Always delete the cookie from the browser, even if database delete failed
        cookiesStore.delete("sessionToken")

        return NextResponse.json({
            success: true, message: "logged out successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Failed to logout:", error)
        return NextResponse.json({
            success: false, message: "internal server error"
        }, { status: 500 })
    }
}