import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { code, email } = await req.json()

        if (!code || !email) {
            return NextResponse.json({
                success: false, message: "Bad Request: code or email is missing "
            }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({
                success: true, message: "This user does not exist!!"
            }, { status: 404 })
        }

        if (user.isVerified) {
            return NextResponse.json({
                success: false, message: "Bad Request: Already verified"
            }, { status: 400 })
        }

        if (user.expiresAt && user.expiresAt < new Date()) {
            return NextResponse.json({
                success: false, message: "session already expired"
            })
        }

        if (user.verificationToken !== code) {
            return NextResponse.json({
                success: false, message: "invalid verification Token"
            }, { status: 400 })
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationToken: null
            }
        })
        const isProduction = process.env.NODE_ENV === "production"
        const cookiesStore = await cookies()
        const sessionToken = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        cookiesStore.set("sessionToken", sessionToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            expires: expiresAt
        })
        
        return NextResponse.json({
            success: true, message: "user successfully verified"
        }, { status: 200 })

    } catch (error) {
        console.error("verification failed", error)
        return NextResponse.json({
            success: false, message: "internal server Error"
        }, { status: 500 })
    }

}